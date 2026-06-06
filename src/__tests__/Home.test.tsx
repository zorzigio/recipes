import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '@/pages/Home'

vi.mock('@/lib/db', () => ({
  getAllRecipes: vi.fn().mockResolvedValue([
    {
      id: '1',
      title: 'Tiramisu',
      description: 'Italian dessert',
      tags: ['dessert', 'italian'],
      baseServings: 8,
      ingredients: [{ id: 'a', name: 'mascarpone', quantity: 500, unit: 'g' }],
      steps: [],
      createdAt: '',
      updatedAt: '',
    },
    {
      id: '2',
      title: 'Pasta Ragu',
      description: 'Italian pasta',
      tags: ['pasta', 'italian'],
      baseServings: 4,
      ingredients: [{ id: 'b', name: 'ground beef', quantity: 400, unit: 'g' }],
      steps: [],
      createdAt: '',
      updatedAt: '',
    },
  ]),
  seedIfEmpty: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/data/recipes', () => ({ default: [] }))

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders recipe cards after loading', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
      expect(screen.getByText('Pasta Ragu')).toBeInTheDocument()
    })
  })

  it('shows result count', async () => {
    renderHome()
    await waitFor(() => {
      expect(screen.getByText(/2 results/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no recipes match search', async () => {
    renderHome()
    await waitFor(() =>
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
    )

    const searchInput = screen.getByRole('textbox', {
      name: /search free text/i,
    })
    await userEvent.type(searchInput, 'XYZnonexistent')

    await waitFor(() => {
      expect(screen.getByText(/no recipes match/i)).toBeInTheDocument()
    })
  })

  it('reset button clears search', async () => {
    renderHome()
    await waitFor(() =>
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
    )

    const searchInput = screen.getByRole('textbox', {
      name: /search free text/i,
    })
    await userEvent.type(searchInput, 'XYZnonexistent')
    await waitFor(() =>
      expect(screen.getByText(/no recipes match/i)).toBeInTheDocument()
    )

    await userEvent.click(screen.getByRole('button', { name: /reset/i }))

    await waitFor(() => {
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
      expect(screen.getByText('Pasta Ragu')).toBeInTheDocument()
    })
  })
})

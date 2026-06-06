import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { App as AntdApp } from 'antd'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Recipe from '@/pages/Recipe'

vi.mock('@/lib/db', () => ({
  getRecipe: vi.fn().mockResolvedValue({
    id: 'tiramisu',
    title: 'Tiramisu',
    description: 'A classic Italian dessert',
    tags: ['dessert', 'italian'],
    baseServings: 8,
    ingredients: [
      { id: 'i1', name: 'mascarpone', quantity: 500, unit: 'g' },
      { id: 'i2', name: 'eggs', quantity: 6, unit: 'unit' },
    ],
    steps: [{ order: 1, text: 'Mix the mascarpone with eggs.' }],
    createdAt: '',
    updatedAt: '',
  }),
  seedIfEmpty: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('@/data/recipes', () => ({ default: [] }))

function renderRecipe(id = 'tiramisu') {
  return render(
    <AntdApp>
      <MemoryRouter initialEntries={[`/recipe/${id}`]}>
        <Routes>
          <Route path="/recipe/:id" element={<Recipe />} />
        </Routes>
      </MemoryRouter>
    </AntdApp>
  )
}

describe('Recipe', () => {
  beforeEach(() => {
    localStorage.clear()
    Object.defineProperty(window, 'print', { value: vi.fn(), writable: true })
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
    })
  })

  it('renders recipe title', async () => {
    renderRecipe()
    await waitFor(() => {
      expect(screen.getByText('Tiramisu')).toBeInTheDocument()
    })
  })

  it('renders ingredient names', async () => {
    renderRecipe()
    await waitFor(() => {
      expect(screen.getAllByText(/mascarpone/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/eggs/i).length).toBeGreaterThan(0)
    })
  })

  it('renders recipe steps', async () => {
    renderRecipe()
    await waitFor(() => {
      expect(
        screen.getByText(/Mix the mascarpone with eggs/i)
      ).toBeInTheDocument()
    })
  })

  it('shows the servings label', async () => {
    renderRecipe()
    await waitFor(() => {
      expect(screen.getByText('Servings')).toBeInTheDocument()
    })
  })

  it('renders recipe description', async () => {
    renderRecipe()
    await waitFor(() => {
      expect(screen.getByText('A classic Italian dessert')).toBeInTheDocument()
    })
  })
})

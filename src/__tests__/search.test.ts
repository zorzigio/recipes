import { describe, it, expect } from 'vitest'
import { filterAndSort } from '@/lib/search'
import type { Recipe } from '@/lib/schema'

const mock: Recipe[] = [
  { id: '1', title: 'Apple Pie', tags: ['dessert'], baseServings: 4, ingredients: [
    { id: 'a', name: 'apple', quantity: 2, unit: 'unit' },
  ], steps: [], createdAt: '', updatedAt: '' },
  { id: '2', title: 'Beef Stew', tags: ['stew'], baseServings: 4, ingredients: [
    { id: 'b', name: 'beef', quantity: 500, unit: 'g' },
  ], steps: [], createdAt: '', updatedAt: '' },
]

describe('search', () => {
  it('filters by text', () => {
    const { results } = filterAndSort(mock, { q: 'apple', tags: [], ingredients: [] })
    expect(results.map(r => r.id)).toEqual(['1'])
  })
  it('filters by tag', () => {
    const { results } = filterAndSort(mock, { q: '', tags: ['dessert'], ingredients: [] })
    expect(results.map(r => r.id)).toEqual(['1'])
  })
  it('filters by ingredients', () => {
    const { results } = filterAndSort(mock, { q: '', tags: [], ingredients: ['bee'] })
    expect(results.map(r => r.id)).toEqual(['2'])
  })
})

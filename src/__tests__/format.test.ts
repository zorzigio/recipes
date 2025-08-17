import { describe, it, expect } from 'vitest'
import { formatQuantity, formatIngredient } from '@/lib/format'

describe('formatQuantity', () => {
  it('trims trailing zeros for decimals', () => {
    expect(formatQuantity(1.5, 'kg')).toBe('1.5 kg')
    // liters round to 1 decimal currently
    expect(formatQuantity(1.25, 'l')).toBe('1.3 l')
  })

  it('keeps integers without decimal part', () => {
    expect(formatQuantity(2, 'unit')).toBe('2 units')
  })

  it('does not pluralize non-plural units', () => {
    expect(formatQuantity(2, 'g')).toBe('2 g')
    expect(formatQuantity(1, 'ml')).toBe('1 ml')
  })

  it('pluralizes word units correctly', () => {
    expect(formatQuantity(2, 'berry')).toBe('2 berries')
    expect(formatQuantity(2, 'dish')).toBe('2 dishes')
    expect(formatQuantity(2, 'box')).toBe('2 boxes')
    expect(formatQuantity(2, 'bag')).toBe('2 bags')
  })

  it('rounds by unit type (count -> integer)', () => {
    expect(formatQuantity(2.6, 'piece')).toBe('3 pieces')
    expect(formatQuantity(2.2, 'slice')).toBe('2 slices')
  })

  it('rounds volumetric units to quarters', () => {
    expect(formatQuantity(0.62, 'tsp')).toBe('0.5 tsp')
    expect(formatQuantity(0.63, 'tbsp')).toBe('0.75 tbsp')
  })
})

describe('formatIngredient', () => {
  it('formats with notes', () => {
    expect(
      formatIngredient({ id: 'x', name: 'butter', quantity: 100, unit: 'g', notes: 'unsalted' })
    ).toBe('100 g butter (unsalted)')
  })

  it('formats with pluralized generic unit', () => {
    expect(
      formatIngredient({ id: 'x', name: 'eggs', quantity: 2, unit: 'unit' })
    ).toBe('2 units eggs')
  })
})

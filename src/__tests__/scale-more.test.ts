import { describe, it, expect } from 'vitest'
import { replaceStepTokens, scaleIngredients } from '@/lib/scale'

describe('replaceStepTokens', () => {
  it('replaces tokens with scaled quantities and units', () => {
    const text = 'Add {q:100,u:"g",n:"butter"} and {q:1,u:"tbsp",n:"sugar"}.'
    const out = replaceStepTokens(text, 2, 4)
    expect(out).toContain('200 g butter')
    expect(out).toContain('2 tbsp sugar')
  })
})

describe('scaleIngredients', () => {
  it('scales a list of ingredients', () => {
    const list = [
      { id: 'a', name: 'flour', quantity: 100, unit: 'g' },
      { id: 'b', name: 'milk', quantity: 200, unit: 'ml' },
    ]
    const out = scaleIngredients(list, 2, 3)
    expect(out[0].quantity).toBe(150)
    expect(out[1].quantity).toBe(300)
  })
})

import { describe, it, expect } from 'vitest'
import { scaleQuantity } from '@/lib/scale'

describe('scaleQuantity', () => {
  it('scales up', () => {
    expect(scaleQuantity(100, 2, 4)).toBe(200)
  })
  it('scales down', () => {
    expect(scaleQuantity(100, 4, 2)).toBe(50)
  })
})

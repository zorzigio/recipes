import { IngredientLine } from './schema'
import { formatQuantity } from './format'

export function scaleQuantity(base: number, baseServings: number, currentServings: number) {
  return (base * currentServings) / baseServings
}

export function scaleIngredient(i: IngredientLine, baseServings: number, currentServings: number): IngredientLine {
  return {
    ...i,
    quantity: scaleQuantity(i.quantity, baseServings, currentServings),
  }
}

export function scaleIngredients(list: IngredientLine[], baseServings: number, currentServings: number) {
  return list.map((i) => scaleIngredient(i, baseServings, currentServings))
}

// Replace tokens like {q:100,u:"g",n:"butter"}
export function replaceStepTokens(text: string, baseServings: number, currentServings: number) {
  return text.replace(/\{\s*q\s*:\s*([0-9]*\.?[0-9]+)\s*,\s*u\s*:\s*\"([^\"]+)\"\s*,\s*n\s*:\s*\"([^\"]+)\"\s*\}/g, (_m, q, u, n) => {
    const qty = Number(q)
    const scaled = scaleQuantity(qty, baseServings, currentServings)
    const formatted = formatQuantity(scaled, u)
    return `${formatted} ${n}`
  })
}

export function servingsFromStorage(id: string, fallback: number) {
  const key = `servings:${id}`
  const v = localStorage.getItem(key)
  const num = v ? parseFloat(v) : NaN
  return Number.isFinite(num) && num > 0 ? num : fallback
}

export function saveServings(id: string, value: number) {
  const key = `servings:${id}`
  localStorage.setItem(key, String(value))
}

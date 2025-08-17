import { IngredientLine } from './schema'

const countUnits = new Set(['piece', 'clove', 'slice', 'unit'])
const metricUnits = new Set(['g', 'ml'])
const volumetricUnits = new Set(['tsp', 'tbsp', 'cup'])

function roundForUnit(value: number, unit: string) {
  if (countUnits.has(unit)) return Math.round(value)
  if (metricUnits.has(unit)) return Math.round(value * 10) / 10
  if (volumetricUnits.has(unit)) return Math.round(value * 4) / 4
  return Math.round(value * 10) / 10
}

function pluralize(word: string, qty: number) {
  if (qty === 1) return word
  if (word.endsWith('y')) return word.replace(/y$/, 'ies')
  if (/(s|x|z|ch|sh)$/.test(word)) return word + 'es'
  return word + 's'
}

export function formatQuantity(qty: number, unit: string) {
  const rounded = roundForUnit(qty, unit)
  const qtyStr = Number.isInteger(rounded)
    ? String(rounded)
    : String(Number(rounded.toFixed(3))).replace(/\.0+$/, '')
  const unitStr = rounded === 1 ? unit : pluralize(unit, rounded)
  return unit ? `${qtyStr} ${unitStr}` : qtyStr
}

export function formatIngredient(i: IngredientLine) {
  const qty = formatQuantity(i.quantity, String(i.unit))
  const notes = i.notes ? ` (${i.notes})` : ''
  return `${qty} ${i.name}${notes}`.trim()
}

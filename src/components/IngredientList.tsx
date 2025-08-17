import type { IngredientLine } from '@/lib/schema'
import { formatIngredient } from '@/lib/format'

export function IngredientList({ items }: { items: IngredientLine[] }) {
  return (
    <ul className="list-disc pl-6 space-y-1">
      {items.map((i) => (
        <li key={i.id}>{formatIngredient(i)}</li>
      ))}
    </ul>
  )
}

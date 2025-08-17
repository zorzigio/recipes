import type { IngredientLine } from '@/lib/schema'
import { formatIngredient } from '@/lib/format'
import { Typography } from 'antd'

export function IngredientList({ items }: { items: IngredientLine[] }) {
  return (
    <ul className="list-disc pl-6 space-y-1">
      {items.map((i) => (
        <li key={i.id}><Typography.Text>{formatIngredient(i)}</Typography.Text></li>
      ))}
    </ul>
  )
}

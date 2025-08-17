import type { Recipe } from '@/lib/schema'
import { Link } from 'react-router-dom'

export function RecipeCard({ r }: { r: Recipe }) {
  return (
    <Link to={`/recipe/${r.id}`} className="rounded border overflow-hidden hover:shadow focus:outline-none focus:ring-2">
      {r.image && <img src={r.image} alt="" className="w-full h-40 object-cover" />}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold">{r.title}</h3>
        {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
        <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
          {r.tags.map((t) => <span key={t} className="px-2 py-0.5 border rounded-full">{t}</span>)}
        </div>
      </div>
    </Link>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { getAllRecipes, seedIfEmpty } from '@/lib/db'
import { filterAndSort, type Filters } from '@/lib/search'
import type { Recipe } from '@/lib/schema'
import recipesSeed from '@/data/recipes.json'
import { Link } from 'react-router-dom'

function useDebounced<T>(value: T, delay = 200) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filters, setFilters] = useState<Filters>(() => {
    try {
      const v = localStorage.getItem('filters')
      return v ? JSON.parse(v) as Filters : { tags: [], ingredients: [], q: '' }
    } catch {
      return { tags: [], ingredients: [], q: '' }
    }
  })

  const qDebounced = useDebounced(filters.q, 200)

  useEffect(() => {
    seedIfEmpty(async () => recipesSeed as Recipe[])
      .then(() => getAllRecipes())
      .then(setRecipes)
  }, [])

  useEffect(() => {
    try { localStorage.setItem('filters', JSON.stringify(filters)) } catch { }
  }, [filters])

  const { results, elapsed } = useMemo(() => filterAndSort(recipes, { ...filters, q: qDebounced }), [recipes, filters, qDebounced])

  const uniqueTags = useMemo(() => Array.from(new Set(recipes.flatMap((r) => r.tags))).sort(), [recipes])

  return (
    <div className="space-y-4">
      <section className="grid gap-2 md:grid-cols-3">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search recipes..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          aria-label="Search free text"
        />
        <select multiple className="border rounded px-3 py-2 min-h-[2.5rem]" value={filters.tags} onChange={(e) => {
          const opts = Array.from(e.target.selectedOptions).map((o) => o.value)
          setFilters((f) => ({ ...f, tags: opts }))
        }} aria-label="Filter by tags">
          {uniqueTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          className="border rounded px-3 py-2"
          placeholder="Ingredients (comma-separated)"
          value={filters.ingredients.join(', ')}
          onChange={(e) => setFilters((f) => ({ ...f, ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
          aria-label="Filter by ingredients"
        />
        <div className="col-span-full flex items-center gap-2 text-sm">
          <button className="border rounded px-3 py-1" onClick={() => setFilters({ tags: [], ingredients: [], q: '' })}>Reset</button>
          <span aria-live="polite">{results.length} results {elapsed ? `( ${Math.round(elapsed)} ms )` : ''}</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <Link key={r.id} to={`/recipe/${r.id}`} className="rounded border overflow-hidden hover:shadow">
            {r.image && <img src={r.image} alt="" className="w-full h-40 object-cover" />}
            <div className="p-3 space-y-2">
              <h3 className="font-semibold">{r.title}</h3>
              {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
              <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                {r.tags.map((t) => <span key={t} className="px-2 py-0.5 border rounded-full">{t}</span>)}
              </div>
            </div>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">No recipes match your filters.</div>
        )}
      </section>
    </div>
  )
}

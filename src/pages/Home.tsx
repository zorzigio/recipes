import { useEffect, useMemo, useState } from 'react'
import { getAllRecipes, seedIfEmpty } from '@/lib/db'
import { filterAndSort } from '@/lib/search'
import type { Recipe } from '@/lib/schema'
import recipesSeed from '@/data/recipes'
import { Input, Select, Button } from 'antd'
import { useFilterParams } from '@/hooks/useFilterParams'
import { useDebounced } from '@/hooks/useDebounced'
import { RecipeCard } from '@/components/RecipeCard'
import { EmptyState } from '@/components/EmptyState'

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const { filters, setFilters, setTags, resetFilters } = useFilterParams()
  const [ingredientsInput, setIngredientsInput] = useState(() =>
    (filters.ingredients ?? []).join(', ')
  )
  const qDebounced = useDebounced(filters.q, 200)
  const ingredientsDebounced = useDebounced(ingredientsInput, 200)

  useEffect(() => {
    seedIfEmpty(async () => recipesSeed as Recipe[])
      .then(() => getAllRecipes())
      .then(setRecipes)
  }, [])

  // When filters.ingredients changes from elsewhere (e.g., reset), reflect it in the input box
  useEffect(() => {
    setIngredientsInput((filters.ingredients ?? []).join(', '))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.ingredients?.join('')])

  // Parse the raw ingredients input on debounce and update filters
  useEffect(() => {
    const parsed = ingredientsDebounced
      .split(/[\s,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    setFilters((f) =>
      f.ingredients.join('') === parsed.join('')
        ? f
        : { ...f, ingredients: parsed }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientsDebounced])

  const { results, elapsed } = useMemo(
    () => filterAndSort(recipes, { ...filters, q: qDebounced }),
    [recipes, filters, qDebounced]
  )
  const uniqueTags = useMemo(
    () => Array.from(new Set(recipes.flatMap((r) => r.tags))).sort(),
    [recipes]
  )

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <Input
          placeholder="Search recipes..."
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          aria-label="Search free text"
        />
        <Select
          mode="multiple"
          placeholder="Filter by tags"
          value={filters.tags}
          onChange={setTags}
          options={uniqueTags.map((t) => ({ value: t, label: t }))}
          aria-label="Filter by tags"
        />
        <Input
          placeholder="Ingredients (comma or space-separated)"
          value={ingredientsInput}
          onChange={(e) => setIngredientsInput(e.target.value)}
          aria-label="Filter by ingredients"
        />
        <div className="col-span-full flex items-center gap-3 text-sm">
          <Button
            onClick={() => {
              resetFilters()
              setIngredientsInput('')
            }}
          >
            Reset
          </Button>
          <span aria-live="polite">
            {results.length} results{' '}
            {elapsed ? `( ${Math.round(elapsed)} ms )` : ''}
          </span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <RecipeCard key={r.id} r={r} />
        ))}
        {results.length === 0 && (
          <EmptyState
            message="No recipes match your filters."
            className="col-span-full"
          />
        )}
      </section>
    </div>
  )
}

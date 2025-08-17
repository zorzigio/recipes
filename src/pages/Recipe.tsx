import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getRecipe, seedIfEmpty } from '@/lib/db'
import type { Recipe as RecipeType } from '@/lib/schema'
import { saveServings, scaleIngredients, replaceStepTokens, servingsFromStorage, scaleQuantity } from '@/lib/scale'
import { formatIngredient, formatQuantity } from '@/lib/format'
import recipesSeed from '@/data/recipes.json'

export default function Recipe() {
  const { id = '' } = useParams()
  const [recipe, setRecipe] = useState<RecipeType | null>(null)
  const [servings, setServings] = useState<number>(0)
  // Buffer for in-progress ingredient edits so typing doesn't get overridden by re-scaling
  const [editing, setEditing] = useState<Record<string, string>>({})

  useEffect(() => {
    seedIfEmpty(async () => recipesSeed as any)
      .then(() => getRecipe(id))
      .then((r) => {
        if (!r) return
        setRecipe(r)
        setServings(servingsFromStorage(r.id, r.baseServings))
      })
  }, [id])

  useEffect(() => {
    if (recipe) saveServings(recipe.id, servings)
  }, [recipe, servings])

  const scaled = useMemo(() => {
    if (!recipe) return null
    const ing = scaleIngredients(recipe.ingredients, recipe.baseServings, servings)
    return { ing }
  }, [recipe, servings])

  if (!recipe) return <div>Loading…</div>

  const copyIngredients = async () => {
    const text = scaled!.ing.map((i) => formatIngredient(i)).join('\n')
    await navigator.clipboard.writeText(text)
  }

  const printRecipe = () => {
    window.print()
  }

  return (
    <article className="space-y-4">
      <header className="flex items-start gap-4">
        {recipe.image && <img src={recipe.image} alt="" className="w-40 h-40 object-cover rounded" />}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{recipe.title}</h1>
          {recipe.description && <p className="text-muted-foreground">{recipe.description}</p>}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {recipe.tags.map((t) => <span key={t} className="px-2 py-0.5 border rounded-full">{t}</span>)}
          </div>
          <div className="text-sm text-muted-foreground">
            {recipe.totalMinutes ? `${recipe.totalMinutes} min • ` : ''}
            {recipe.difficulty ? `${recipe.difficulty} • ` : ''}
            base {recipe.baseServings} servings
          </div>
        </div>
      </header>

      <section className="flex items-center gap-2" aria-live="polite">
        <label className="text-sm">Servings</label>
        <input type="number" className="border rounded px-2 py-1 w-20" min={0.25} step={0.25} value={servings} onChange={(e) => setServings(parseFloat(e.target.value) || 1)} />
        <button className="border rounded px-3 py-1" onClick={() => setServings((s) => Math.max(0.25, Math.round((s - 0.5) * 100) / 100))}>-</button>
        <button className="border rounded px-3 py-1" onClick={() => setServings((s) => Math.round((s + 0.5) * 100) / 100)}>+</button>
        <div className="ml-auto flex gap-2">
          <button className="border rounded px-3 py-1" onClick={copyIngredients}>Copy ingredients</button>
          <button className="border rounded px-3 py-1" onClick={printRecipe}>Print</button>
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Ingredients</h2>
        <ul className="space-y-2">
          {scaled!.ing.map((i) => {
            const base = recipe.ingredients.find((b) => b.id === i.id)!
            const stepForUnit = (unit: string) => {
              const u = unit.toLowerCase()
              if (u === 'g' || u === 'ml') return 0.1
              if (u === 'kg' || u === 'l') return 0.01
              if (u === 'tsp' || u === 'tbsp' || u === 'cup') return 0.25
              return 1
            }
            const commitQty = (val: number | null) => {
              // Clear editing buffer for this ingredient and, if valid, update servings
              setEditing((prev) => {
                const next = { ...prev }
                delete next[i.id]
                return next
              })
              if (val == null || !Number.isFinite(val)) return
              if (!base || !Number.isFinite(base.quantity) || base.quantity <= 0) return
              const rawServings = (val * recipe.baseServings) / base.quantity
              const targetServings = Math.max(0.25, Math.round(rawServings * 100) / 100)
              setServings(targetServings)
            }
            const inputId = `ing-${i.id}`
            const displayValue = editing[i.id] ?? String(Number(i.quantity.toFixed(3)))
            return (
              <li key={i.id} className="flex items-center gap-3">
                <label htmlFor={inputId} className="sr-only">{i.name} quantity</label>
                <input
                  id={inputId}
                  type="number"
                  min={0}
                  step={stepForUnit(String(i.unit))}
                  className="w-28 border rounded px-2 py-1"
                  value={displayValue}
                  inputMode="decimal"
                  onChange={(e) => setEditing((prev) => ({ ...prev, [i.id]: e.target.value }))}
                  onBlur={(e) => commitQty(e.target.value === '' ? null : parseFloat(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      const valStr = (e.target as HTMLInputElement).value
                      commitQty(valStr === '' ? null : parseFloat(valStr))
                    } else if (e.key === 'Escape') {
                      e.preventDefault()
                      // Cancel edit and revert to scaled value
                      setEditing((prev) => {
                        const next = { ...prev }
                        delete next[i.id]
                        return next
                      })
                    }
                  }}
                  aria-label={`${i.name} quantity`}
                  title="Adjust this ingredient; others will scale"
                />
                <div className="text-sm">
                  <span className="font-medium mr-1">{String(i.unit)}</span>
                  <span>{i.name}{i.notes ? ` (${i.notes})` : ''}</span>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-2">Steps</h2>
        <ol className="list-decimal pl-6 space-y-2">
          {recipe.steps.map((s) => (
            <li key={s.order}>{replaceStepTokens(s.text, recipe.baseServings, servings)}</li>
          ))}
        </ol>
      </section>
    </article>
  )
}

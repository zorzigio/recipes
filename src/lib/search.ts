import { Recipe } from './schema'

export type Filters = {
  tags: string[]
  ingredients: string[] // names (substring match)
  q: string // free text
}

function norm(s: string) {
  return s.toLowerCase()
}

export function recipeMatches(r: Recipe, f: Filters) {
  // AND across groups
  // tags: all selected must be included
  if (f.tags.length && !f.tags.every((t) => r.tags.map(norm).includes(norm(t)))) return false

  // ingredients: must include all substrings in ingredient names
  if (f.ingredients.length) {
    const names = r.ingredients.map((i) => norm(i.name))
    const ok = f.ingredients.every((needle) =>
      names.some((n) => n.includes(norm(needle)))
    )
    if (!ok) return false
  }

  // free text: search in title, tags, ingredient names
  const term = norm(f.q || '')
  if (term) {
    const hay = [r.title, r.description || '', ...r.tags, ...r.ingredients.map((i) => i.name)]
      .map(norm)
      .join(' ')
    if (!hay.includes(term)) return false
  }

  return true
}

export function filterAndSort(recipes: Recipe[], f: Filters) {
  const t0 = performance.now()
  const out = recipes.filter((r) => recipeMatches(r, f))
  // simple sort: title asc
  out.sort((a, b) => a.title.localeCompare(b.title))
  const elapsed = performance.now() - t0
  return { results: out, elapsed }
}

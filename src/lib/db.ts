import { openDB, IDBPDatabase } from 'idb'
import type { Recipe } from './schema'

const DB_NAME = 'recipes-db'
const STORE = 'recipes'
const VERSION = 1

let dbPromise: Promise<IDBPDatabase> | null = null
const LS_KEY = 'recipes:store'

async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, VERSION, {
      upgrade(db: IDBPDatabase) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise!
}

function deepEqualRecipeContent(a: Recipe, b: Recipe): boolean {
  // Compare core fields excluding createdAt (allow updatedAt to differ to force refresh)
  const clean = (r: Recipe) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    image: r.image,
    tags: r.tags,
    baseServings: r.baseServings,
    totalMinutes: r.totalMinutes,
    difficulty: r.difficulty,
    ingredients: r.ingredients,
    steps: r.steps,
  })
  return JSON.stringify(clean(a)) === JSON.stringify(clean(b))
}

export async function seedIfEmpty(fetcher: () => Promise<Recipe[]>) {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE, 'readonly')
    const count = await tx.store.count()
    await tx.done
    const recipes = await fetcher()
    if (count === 0) {
      const wtx = (await getDB()).transaction(STORE, 'readwrite')
      for (const r of recipes) await wtx.store.put(r)
      await wtx.done
      localStorage.setItem(LS_KEY, JSON.stringify(recipes))
      return
    }
    // Merge: add new recipes and update existing changed ones
    const readAllTx = (await getDB()).transaction(STORE, 'readonly')
    const existingArr = (await readAllTx.store.getAll()) as Recipe[]
    await readAllTx.done
    const byId = new Map(existingArr.map((r) => [r.id, r]))

    const changedOrNew: Recipe[] = []
    for (const r of recipes) {
      const ex = byId.get(r.id)
      if (!ex) {
        changedOrNew.push(r)
      } else {
        const same = deepEqualRecipeContent(ex, r)
        if (!same) {
          // Preserve createdAt if present
          const updated: Recipe = { ...r, createdAt: ex.createdAt ?? r.createdAt }
          changedOrNew.push(updated)
        }
      }
    }

    if (changedOrNew.length) {
      const wtx = (await getDB()).transaction(STORE, 'readwrite')
      for (const r of changedOrNew) await wtx.store.put(r)
      await wtx.done
      try {
        // Update LS: replace existing ids with new content or append new
        const raw = localStorage.getItem(LS_KEY)
        const lsArr: Recipe[] = raw ? JSON.parse(raw) : []
        const map = new Map(lsArr.map((r) => [r.id, r]))
        for (const r of changedOrNew) map.set(r.id, r)
        localStorage.setItem(LS_KEY, JSON.stringify(Array.from(map.values())))
      } catch {
        // ignore localStorage errors
      }
    }
  } catch {
    // Fallback to localStorage
    try {
      const v = localStorage.getItem(LS_KEY)
      const recipes = await fetcher()
      if (!v) {
        localStorage.setItem(LS_KEY, JSON.stringify(recipes))
        return
      }
      const current: Recipe[] = JSON.parse(v)
      const map = new Map(current.map((r) => [r.id, r]))
      for (const r of recipes) {
        const ex = map.get(r.id)
        if (!ex || !deepEqualRecipeContent(ex, r)) map.set(r.id, r)
      }
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(map.values())))
    } catch {
      // ignore localStorage errors
    }
  }
}

export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE, 'readonly')
    const all = await tx.store.getAll()
    await tx.done
    return all as Recipe[]
  } catch {
    try {
      const v = localStorage.getItem(LS_KEY)
      return v ? (JSON.parse(v) as Recipe[]) : []
  } catch {
      return []
    }
  }
}

export async function getRecipe(id: string): Promise<Recipe | undefined> {
  try {
    const db = await getDB()
    const tx = db.transaction(STORE, 'readonly')
    const r = await tx.store.get(id)
    await tx.done
    return r as Recipe | undefined
  } catch {
    try {
      const v = localStorage.getItem(LS_KEY)
      const arr: Recipe[] = v ? JSON.parse(v) : []
      return arr.find((r) => r.id === id)
  } catch {
      return undefined
    }
  }
}

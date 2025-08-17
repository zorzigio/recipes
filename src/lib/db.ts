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
    // Merge: add any new recipes that aren't present yet
    const readTx = (await getDB()).transaction(STORE, 'readonly')
    const existingIds = new Set<string>((await readTx.store.getAllKeys()) as string[])
    await readTx.done
    const toAdd = recipes.filter((r) => !existingIds.has(r.id))
    if (toAdd.length) {
      const wtx = (await getDB()).transaction(STORE, 'readwrite')
      for (const r of toAdd) await wtx.store.put(r)
      await wtx.done
      try {
        // Merge LS too
        const raw = localStorage.getItem(LS_KEY)
        const lsArr: Recipe[] = raw ? JSON.parse(raw) : []
        const lsIds = new Set(lsArr.map((r) => r.id))
        const merged = lsArr.concat(toAdd.filter((r) => !lsIds.has(r.id)))
        localStorage.setItem(LS_KEY, JSON.stringify(merged))
      } catch {
        // ignore JSON/localStorage errors during merge
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
      const ids = new Set(current.map((r) => r.id))
      const merged = current.concat(recipes.filter((r) => !ids.has(r.id)))
      localStorage.setItem(LS_KEY, JSON.stringify(merged))
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

import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Filters } from '@/lib/search'
import { storage } from '@/lib/storage'

function isFilters(v: unknown): v is Filters {
  if (!v || typeof v !== 'object') return false
  const f = v as Record<string, unknown>
  return (
    Array.isArray(f.tags) &&
    Array.isArray(f.ingredients) &&
    typeof f.q === 'string'
  )
}

const EMPTY_FILTERS: Filters = { tags: [], ingredients: [], q: '' }

export function useFilterParams() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>(() =>
    storage.get('filters', EMPTY_FILTERS, isFilters)
  )

  // Sync URL tags → filter state when URL changes (e.g., navigating back from recipe page)
  useEffect(() => {
    const tagsFromParams = searchParams.getAll('tag')
    const tagsCsv = searchParams.get('tags')
    const tagsExtra = tagsCsv
      ? tagsCsv
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : []
    const nextTags = Array.from(new Set([...tagsFromParams, ...tagsExtra]))
    if (nextTags.length === 0) return
    const current = filters.tags
    const same =
      current.length === nextTags.length &&
      current.every((t, i) => t === nextTags[i])
    if (!same) setFilters((f) => ({ ...f, tags: nextTags }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Persist filters to localStorage whenever they change
  useEffect(() => {
    storage.set('filters', filters)
  }, [filters])

  const setTags = (tags: string[]) => {
    setFilters((f) => ({ ...f, tags }))
    const qs = new URLSearchParams()
    tags.forEach((t) => qs.append('tag', t))
    navigate(`/?${qs.toString()}`)
  }

  const resetFilters = () => {
    setFilters(EMPTY_FILTERS)
    navigate('/')
  }

  return { filters, setFilters, setTags, resetFilters }
}

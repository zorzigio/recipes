import { useEffect, useMemo, useState } from 'react'
import { getAllRecipes, seedIfEmpty } from '@/lib/db'
import { filterAndSort, type Filters } from '@/lib/search'
import type { Recipe } from '@/lib/schema'
import recipesSeed from '@/data/recipes'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Input, Select, Button, Tag, Card, Typography, Space } from 'antd'

function useDebounced<T>(value: T, delay = 200) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return v
}

export default function Home() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
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
    try { localStorage.setItem('filters', JSON.stringify(filters)) } catch {
      // ignore localStorage write errors
    }
  }, [filters])

  // Sync tags from URL (?tag=foo&tag=bar or ?tags=foo,bar)
  useEffect(() => {
    const tagsFromParams = searchParams.getAll('tag')
    const tagsCsv = searchParams.get('tags')
    const tagsExtra = tagsCsv ? tagsCsv.split(',').map((s) => s.trim()).filter(Boolean) : []
    const nextTags = Array.from(new Set([...tagsFromParams, ...tagsExtra]))
    if (nextTags.length === 0) return
    const current = filters.tags
    const same = current.length === nextTags.length && current.every((t, i) => t === nextTags[i])
    if (!same) setFilters((f) => ({ ...f, tags: nextTags }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const { results, elapsed } = useMemo(() => filterAndSort(recipes, { ...filters, q: qDebounced }), [recipes, filters, qDebounced])

  const uniqueTags = useMemo(() => Array.from(new Set(recipes.flatMap((r) => r.tags))).sort(), [recipes])

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
          onChange={(opts) => {
            setFilters((f) => ({ ...f, tags: opts }))
            const qs = new URLSearchParams()
            opts.forEach((t) => qs.append('tag', t))
            navigate(`/?${qs.toString()}`)
          }}
          options={uniqueTags.map((t) => ({ value: t, label: t }))}
          aria-label="Filter by tags"
        />
        <Input
          placeholder="Ingredients (comma-separated)"
          value={filters.ingredients.join(', ')}
          onChange={(e) => setFilters((f) => ({ ...f, ingredients: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }))}
          aria-label="Filter by ingredients"
        />
        <div className="col-span-full flex items-center gap-3 text-sm">
          <Button onClick={() => { setFilters({ tags: [], ingredients: [], q: '' }); navigate('/') }}>Reset</Button>
          <span aria-live="polite">{results.length} results {elapsed ? `( ${Math.round(elapsed)} ms )` : ''}</span>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <Link key={r.id} to={`/recipe/${r.id}`}>
            <Card hoverable cover={r.image ? <img src={r.image} alt="" style={{ height: 160, objectFit: 'cover' }} /> : undefined}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Typography.Title level={5} style={{ margin: 0 }}>{r.title}</Typography.Title>
                {r.description && <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>{r.description}</Typography.Paragraph>}
                <div className="flex flex-wrap gap-1">
                  {r.tags.map((t) => {
                    const active = filters.tags.includes(t)
                    return (
                      <Tag
                        key={t}
                        color={active ? 'blue' : undefined}
                        bordered={!active}
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setFilters((f) => {
                            const exists = f.tags.includes(t)
                            const next = exists ? f.tags.filter((x) => x !== t) : [...f.tags, t]
                            const qs = new URLSearchParams()
                            next.forEach((tg) => qs.append('tag', tg))
                            navigate(`/?${qs.toString()}`)
                            return { ...f, tags: next }
                          })
                        }}
                      >
                        {t}
                      </Tag>
                    )
                  })}
                </div>
              </Space>
            </Card>
          </Link>
        ))}
        {results.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">No recipes match your filters.</div>
        )}
      </section>
    </div>
  )
}

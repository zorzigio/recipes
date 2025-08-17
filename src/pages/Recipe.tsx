import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { getRecipe, seedIfEmpty } from '@/lib/db'
import type { Recipe as RecipeType } from '@/lib/schema'
import { saveServings, scaleIngredients, replaceStepTokens, servingsFromStorage, scaleQuantity } from '@/lib/scale'
import { formatIngredient, formatQuantity } from '@/lib/format'
import recipesSeed from '@/data/recipes.json'
import { Button, InputNumber, Typography, Tag, Divider, Space, App as AntdApp, Modal, QRCode } from 'antd'
import { useLocation } from 'react-router-dom'

export default function Recipe() {
  const { message } = AntdApp.useApp()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTags = new Set<string>([...searchParams.getAll('tag'), ...(searchParams.get('tags')?.split(',').map((s) => s.trim()).filter(Boolean) ?? [])])
  const location = useLocation()
  const [qrOpen, setQrOpen] = useState(false)
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
        const fromUrl = parseFloat((searchParams.get('servings') ?? '').trim())
        const initial = Number.isFinite(fromUrl) && fromUrl > 0
          ? fromUrl
          : servingsFromStorage(r.id, r.baseServings)
        setServings(initial)
      })
  }, [id])

  useEffect(() => {
    if (recipe) saveServings(recipe.id, servings)
  }, [recipe, servings])

  // Keep servings reflected in URL without losing existing params
  useEffect(() => {
    const next = new URLSearchParams(searchParams)
    const val = String(Number(servings.toFixed(3)))
    next.set('servings', val)
    setSearchParams(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servings])

  const scaled = useMemo(() => {
    if (!recipe) return null
    const ing = scaleIngredients(recipe.ingredients, recipe.baseServings, servings)
    return { ing }
  }, [recipe, servings])

  if (!recipe) return <div>Loading…</div>

  const copyIngredients = async () => {
    try {
      const text = scaled!.ing.map((i) => formatIngredient(i)).join('\n')
      await navigator.clipboard.writeText(text)
      message.success('Ingredients copied to clipboard')
    } catch (e) {
      message.error('Failed to copy ingredients')
    }
  }

  const printRecipe = () => {
    window.print()
  }

  return (
    <article className="space-y-4">
      <header className="flex items-start gap-4">
        {recipe.image && <img src={recipe.image} alt="" className="w-40 h-40 object-cover rounded" />}
        <div className="space-y-1">
          <Typography.Title level={2} style={{ marginTop: 0 }}>{recipe.title}</Typography.Title>
          {recipe.description && <Typography.Paragraph type="secondary">{recipe.description}</Typography.Paragraph>}
          <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
            {recipe.tags.map((t) => (
              <Tag
                key={t}
                color={activeTags.has(t) ? 'blue' : undefined}
                bordered={!activeTags.has(t)}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  const next = new URLSearchParams(searchParams)
                  const current = next.getAll('tag')
                  if (activeTags.has(t)) {
                    // remove t
                    const filtered = current.filter((x) => x !== t)
                    next.delete('tag')
                    filtered.forEach((x) => next.append('tag', x))
                  } else {
                    next.append('tag', t)
                  }
                  navigate(`/?${next.toString()}`)
                }}
              >
                {t}
              </Tag>
            ))}
          </div>
          <Typography.Text type="secondary">
            {recipe.totalMinutes ? `${recipe.totalMinutes} min • ` : ''}
            {recipe.difficulty ? `${recipe.difficulty} • ` : ''}
            base {recipe.baseServings} servings
          </Typography.Text>
        </div>
      </header>

      <section className="flex items-center gap-2" aria-live="polite">
        <label className="text-sm">Servings</label>
        <InputNumber min={0.25} step={0.25} value={servings} onChange={(v) => setServings(Number(v) || 1)} />
        <Button onClick={() => setServings((s) => Math.max(0.25, Math.round((s - 0.5) * 100) / 100))}>-</Button>
        <Button onClick={() => setServings((s) => Math.round((s + 0.5) * 100) / 100)}>+</Button>
        <div className="ml-auto flex gap-2">
          <Button onClick={copyIngredients}>Copy ingredients</Button>
          <Button onClick={printRecipe}>Print</Button>
          <Button onClick={() => setQrOpen(true)}>QR code</Button>
        </div>
      </section>

      <Modal
        open={qrOpen}
        onCancel={() => setQrOpen(false)}
        footer={null}
        title="Scan to open"
        centered
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {(() => {
            const href = typeof window !== 'undefined' ? window.location.href : location.pathname
            try {
              const url = new URL(href, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
              url.searchParams.set('servings', String(Number(servings.toFixed(3))))
              return <QRCode value={url.toString()} size={200} />
            } catch {
              return <QRCode value={href} size={200} />
            }
          })()}
        </div>
        <Typography.Paragraph type="secondary" style={{ marginTop: 12, textAlign: 'center' }}>
          {(() => {
            const href = typeof window !== 'undefined' ? window.location.href : location.pathname
            try {
              const url = new URL(href, typeof window !== 'undefined' ? window.location.origin : 'http://localhost')
              url.searchParams.set('servings', String(Number(servings.toFixed(3))))
              return url.toString()
            } catch {
              return href
            }
          })()}
        </Typography.Paragraph>
      </Modal>

      <section>
        <Typography.Title level={4}>Ingredients</Typography.Title>
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
                <InputNumber
                  id={inputId}
                  min={0}
                  step={stepForUnit(String(i.unit))}
                  value={Number(displayValue)}
                  formatter={(v) => {
                    if (v == null) return ''
                    const s = String(v)
                    if (!s.includes('.')) return s
                    return s
                      .replace(/(\.\d*?[1-9])0+$/, '$1')
                      .replace(/\.0+$/, '')
                      .replace(/\.$/, '')
                  }}
                  parser={(v) => {
                    if (!v) return '' as unknown as number
                    const s = v.replace(/[^0-9.\-]/g, '')
                    return s as unknown as number
                  }}
                  onChange={(v) => setEditing((prev) => ({ ...prev, [i.id]: v == null ? '' : String(v) }))}
                  onBlur={(e) => commitQty((e.target as HTMLInputElement).value === '' ? null : parseFloat((e.target as HTMLInputElement).value))}
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
        <Typography.Title level={4}>Steps</Typography.Title>
        <ol className="list-decimal pl-6 space-y-2">
          {recipe.steps.map((s) => (
            <li key={s.order}>{replaceStepTokens(s.text, recipe.baseServings, servings)}</li>
          ))}
        </ol>
      </section>
    </article>
  )
}

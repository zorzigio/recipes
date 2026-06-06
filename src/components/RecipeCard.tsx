import type { Recipe } from '@/lib/schema'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Tag, Typography } from 'antd'

export function RecipeCard({ r }: { r: Recipe }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const active = new Set<string>([
    ...searchParams.getAll('tag'),
    ...(searchParams
      .get('tags')
      ?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? []),
  ])
  return (
    <Link to={`/recipe/${r.id}`} style={{ display: 'flex', height: '100%' }}>
      <Card
        hoverable
        style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
        styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column' } }}
        cover={
          r.image ? (
            <img
              src={r.image}
              alt=""
              style={{ height: 160, objectFit: 'cover' }}
            />
          ) : undefined
        }
      >
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}
        >
          <Typography.Title level={5} style={{ margin: 0 }}>
            {r.title}
          </Typography.Title>
          {r.description && (
            <Typography.Paragraph
              type="secondary"
              ellipsis={{ rows: 2 }}
              style={{ margin: 0, flex: 1 }}
            >
              {r.description}
            </Typography.Paragraph>
          )}
          <div className="flex flex-wrap gap-1" style={{ marginTop: 'auto' }}>
            {r.tags.map((t) => (
              <Tag
                key={t}
                color={active.has(t) ? 'blue' : undefined}
                bordered={!active.has(t)}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  const next = new URLSearchParams(searchParams)
                  const current = next.getAll('tag')
                  if (active.has(t)) {
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
        </div>
      </Card>
    </Link>
  )
}

import type { Recipe } from '@/lib/schema'
import { Link } from 'react-router-dom'
import { Card, Tag, Typography, Space } from 'antd'

export function RecipeCard({ r }: { r: Recipe }) {
  return (
    <Link to={`/recipe/${r.id}`}>
      <Card hoverable cover={r.image ? <img src={r.image} alt="" style={{ height: 160, objectFit: 'cover' }} /> : undefined}>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Typography.Title level={5} style={{ margin: 0 }}>{r.title}</Typography.Title>
          {r.description && <Typography.Paragraph type="secondary" ellipsis={{ rows: 2 }}>{r.description}</Typography.Paragraph>}
          <div className="flex flex-wrap gap-1">
            {r.tags.map((t) => <Tag key={t}>{t}</Tag>)}
          </div>
        </Space>
      </Card>
    </Link>
  )
}

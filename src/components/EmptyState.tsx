import { Typography } from 'antd'

export function EmptyState({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="text-center py-12">
      <Typography.Text type="secondary">{message}</Typography.Text>
    </div>
  )
}

import { Typography } from 'antd'

export function EmptyState({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`text-center py-12 ${className ?? ''}`}
    >
      <Typography.Text type="secondary">{message}</Typography.Text>
    </div>
  )
}

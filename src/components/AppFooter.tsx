import { Layout, Typography, Space, Tooltip } from 'antd'

const { Footer } = Layout

export function AppFooter() {
  const buildTime = import.meta.env.VITE_BUILD_TIME
  const commit = import.meta.env.VITE_GIT_COMMIT
  const version = import.meta.env.VITE_APP_VERSION

  const formatted = buildTime
    ? new Date(buildTime).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    : 'dev'

  return (
    <Footer style={{ borderTop: '1px solid var(--border)', background: 'transparent', paddingInline: 0 }}>
      <div className="container py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <Typography.Text type="secondary">
          Build: {formatted}
        </Typography.Text>
        <Space size={12} wrap>
          {version && (
            <Typography.Text type="secondary">v{version}</Typography.Text>
          )}
          {commit && (
            <Tooltip title="Git commit">
              <Typography.Text type="secondary">{commit}</Typography.Text>
            </Tooltip>
          )}
        </Space>
      </div>
    </Footer>
  )
}

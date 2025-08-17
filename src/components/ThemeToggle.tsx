import { Button } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { mode, toggle } = useTheme()
  return (
    <Button size="small" onClick={toggle} aria-label="Toggle theme" icon={<BulbOutlined />}>
      {mode === 'dark' ? 'Light' : 'Dark'}
    </Button>
  )
}

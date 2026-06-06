import { Button } from 'antd'
import { SunOutlined, MoonOutlined } from '@ant-design/icons'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { mode, toggle } = useTheme()
  return (
    <Button
      shape="circle"
      onClick={toggle}
      aria-label={
        mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
    />
  )
}

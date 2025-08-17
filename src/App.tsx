import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { Layout, Menu, Typography } from 'antd'
import { AppFooter } from './components/AppFooter'
const { Header, Content } = Layout

export default function App() {
  const location = useLocation()
  const selectedKey = location.pathname.startsWith('/recipe') ? '/recipe' : '/'
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ borderBottom: '1px solid var(--border)', background: 'transparent', paddingInline: 0 }}>
        <div className="container flex items-center justify-between py-2 gap-2">
          <Typography.Title level={4} style={{ margin: 0 }}>
            <Link to="/">Recipes</Link>
          </Typography.Title>
          <div className="flex items-center gap-2">
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{ borderBottom: 'none', background: 'transparent' }}
              items={[
                { key: '/', label: <NavLink to="/">Home</NavLink> },
              ]}
            />
            <ThemeToggle />
          </div>
        </div>
      </Header>
      <Content>
        <div className="container py-6">
          <Outlet />
        </div>
      </Content>
      <AppFooter />
    </Layout>
  )
}

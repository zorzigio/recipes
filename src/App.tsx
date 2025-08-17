import { Outlet, Link, NavLink } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { Layout, Menu, Typography } from 'antd'
const { Header, Content } = Layout

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="container flex items-center justify-between py-2 gap-4">
          <Typography.Title level={4} style={{ margin: 0 }}>
            <Link to="/">Recipes</Link>
          </Typography.Title>
          <div className="flex items-center gap-3">
            <Menu mode="horizontal" selectable={false} items={[{ key: 'home', label: <NavLink to="/">Home</NavLink> }]} />
            <ThemeToggle />
          </div>
        </div>
      </Header>
      <Content>
        <div className="container py-6">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}

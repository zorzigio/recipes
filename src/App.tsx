import { Outlet, Link, useLocation } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'
import { Layout, Breadcrumb, Typography } from 'antd'
import { AppFooter } from './components/AppFooter'
import { UtensilsCrossed } from 'lucide-react'

const { Header, Content } = Layout

export default function App() {
  const location = useLocation()
  const isRecipePage = location.pathname.startsWith('/recipe')

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--background)',
          paddingInline: 0,
          height: 52,
          lineHeight: '52px',
        }}
      >
        <div className="container flex items-center justify-between h-full gap-4">
          <Link
            to="/"
            className="flex items-center gap-2"
            style={{ textDecoration: 'none' }}
          >
            <UtensilsCrossed size={18} strokeWidth={1.75} />
            <Typography.Title
              level={5}
              style={{ margin: 0, lineHeight: 'inherit' }}
            >
              Recipes
            </Typography.Title>
          </Link>

          {isRecipePage && (
            <Breadcrumb
              items={[{ title: <Link to="/">Home</Link> }, { title: 'Recipe' }]}
            />
          )}

          <ThemeToggle />
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

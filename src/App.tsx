import { Outlet, Link, NavLink } from 'react-router-dom'
import { ThemeToggle } from './components/ThemeToggle'

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4 gap-4">
          <Link to="/" className="font-bold text-lg">Recipes</Link>
          <nav className="flex items-center gap-4 text-sm">
            <NavLink to="/" className={({ isActive }) => isActive ? 'underline' : ''}>Home</NavLink>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  )
}

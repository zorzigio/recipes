import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ConfigProvider, App as AntdApp, theme as antdTheme, type ThemeConfig } from 'antd'

type Mode = 'light' | 'dark'

function getPreferredTheme(): Mode {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark' || saved === 'light') return saved
    } catch {
      // ignore localStorage read errors
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    return mq.matches ? 'dark' : 'light'
  }
  return 'light'
}

type ThemeCtx = {
  mode: Mode
  toggle: () => void
  setMode: (m: Mode) => void
}

const ThemeContext = createContext<ThemeCtx | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => getPreferredTheme())

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    try { localStorage.setItem('theme', mode) } catch {
      // ignore localStorage write errors
    }
  }, [mode])

  const cfg: ThemeConfig = useMemo(() => ({
    algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    token: {
      // Optional: align primary with Tailwind-ish palette if desired
      // colorPrimary: '#1677ff',
    },
  }), [mode])

  const value = useMemo<ThemeCtx>(() => ({
    mode,
    toggle: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    setMode,
  }), [mode])

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={cfg} componentSize="middle">
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

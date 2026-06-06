import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Recipes',
        short_name: 'Recipes',
        description: 'Offline-capable read-only recipes app',
        theme_color: '#111827',
        background_color: '#111827',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'StaleWhileRevalidate' as const,
            options: {
              cacheName: 'assets-cache',
            },
          },
        ],
      },
    }),
  ],
  define: (() => {
    const buildTime = new Date().toISOString()
    let commit = ''
    try {
      commit = execSync('git rev-parse --short HEAD').toString().trim()
    } catch {
      // git not available (e.g., in some CI environments)
      commit = ''
    }
    const version = process.env.npm_package_version ?? ''
    return {
      'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
      'import.meta.env.VITE_GIT_COMMIT': JSON.stringify(commit),
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(version),
    }
  })(),
  base: mode === 'production' ? '/recipes_v2/' : '/',
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/data/**'],
      thresholds: { lines: 40 },
    },
  },
}))

// ESLint v9+ flat config
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  // Ignore patterns (replaces .eslintignore)
  {
    ignores: ['dist', 'coverage', 'node_modules', 'public', '*.config.*', '*.conf.*'],
  },
  // Base JS recommendations
  js.configs.recommended,
  // TypeScript recommendations
  ...tseslint.configs.recommended,
  // React + Hooks recommendations
  react.configs.recommended,
  reactHooks.configs.recommended,
  // Project-specific tweaks
  {
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
]

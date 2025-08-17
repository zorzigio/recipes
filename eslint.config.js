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
  // TypeScript recommendations (flat-config ready)
  ...tseslint.configs.recommended,
  // React + Hooks plugin setup with a minimal rule set
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React core
      'react/react-in-jsx-scope': 'off',
      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]

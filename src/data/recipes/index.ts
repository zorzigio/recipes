import type { Recipe } from '@/lib/schema'

// Eagerly import all recipe modules in this folder and aggregate their default exports.
const modules = import.meta.glob('./*.ts', { eager: true }) as Record<string, { default?: Recipe }>

const recipes: Recipe[] = Object.entries(modules)
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([, m]) => m.default)
	.filter((r): r is Recipe => Boolean(r))

export default recipes

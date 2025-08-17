export type Unit =
  | 'g' | 'kg' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup' | 'piece' | 'clove' | 'slice' | 'pinch' | 'unit'

export type IngredientLine = {
  id: string
  name: string
  quantity: number
  unit: Unit | string
  notes?: string
}
export type Step = { order: number; text: string }
export type Recipe = {
  id: string
  title: string
  description?: string
  image?: string
  tags: string[]
  baseServings: number
  totalMinutes?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  ingredients: IngredientLine[]
  steps: Step[]
  createdAt: string
  updatedAt: string
}

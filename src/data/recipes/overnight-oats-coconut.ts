import type { Recipe } from '@/lib/schema'

const recipe: Recipe = {
  id: 'overnight-oats-coconut',
  title: 'Overnight Oats with Coconut Milk',
  description:
    'Creamy, no-cook oats soaked overnight in coconut milk. Ready in the morning — just top and eat.',
  image: '/images/overnight-oats.png',
  tags: ['breakfast', 'vegan', 'no-cook', 'meal-prep'],
  baseServings: 1,
  totalMinutes: 5,
  difficulty: 'easy',
  ingredients: [
    { id: 'oats', name: 'rolled oats', quantity: 60, unit: 'g' },
    {
      id: 'coconut-milk',
      name: 'full-fat coconut milk',
      quantity: 100,
      unit: 'ml',
    },
    { id: 'chia', name: 'chia seeds', quantity: 1, unit: 'tbsp' },
    { id: 'maple', name: 'maple syrup', quantity: 1, unit: 'tbsp' },
    { id: 'vanilla', name: 'vanilla extract', quantity: 0.5, unit: 'tsp' },
    { id: 'salt', name: 'salt', quantity: 1, unit: 'pinch' },
    {
      id: 'coconut-fl',
      name: 'toasted coconut flakes',
      quantity: 1,
      unit: 'tbsp',
    },
    {
      id: 'fruit',
      name: 'fresh fruit (mango, banana, or berries)',
      quantity: 0.5,
      unit: 'cup',
    },
  ],
  steps: [
    {
      order: 1,
      text: 'Combine {q:60,u:"g",n:"rolled oats"}, {q:100,u:"ml",n:"full-fat coconut milk"} in a bowl or jar. Stir well.',
    },
    {
      order: 2,
      text: 'Add {q:1,u:"tbsp",n:"chia seeds"}, {q:1,u:"tbsp",n:"maple syrup"}, {q:0.5,u:"tsp",n:"vanilla extract"}, and a pinch of salt. Stir again until everything is evenly combined.',
    },
    {
      order: 3,
      text: 'Put in a jar or airtight container. Cover and refrigerate overnight, or for at least 6 hours.',
    },
    {
      order: 4,
      text: 'In the morning, give the oats a stir. If too thick, loosen with a splash of coconut milk or water.',
    },
    {
      order: 5,
      text: 'Top with {q:0.5,u:"cup",n:"fresh fruit"} and {q:1,u:"tbsp",n:"toasted coconut flakes"} before serving.',
    },
  ],
  createdAt: '2026-06-07T00:00:00.000Z',
  updatedAt: '2026-06-07T00:00:00.000Z',
}

export default recipe

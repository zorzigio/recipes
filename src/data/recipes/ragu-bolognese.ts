import type { Recipe } from '@/lib/schema'

const recipe: Recipe = {
  id: 'ragu-bolognese',
  title: 'Ragù alla Bolognese',
  description: 'Classic slow-cooked meat sauce from Bologna, perfect with tagliatelle.',
  image: '/images/bolognese.jpg',
  tags: ['Italian', 'pasta', 'slow-cook'],
  baseServings: 4,
  totalMinutes: 180,
  difficulty: 'medium',
  ingredients: [
    { id: 'oil', name: 'olive oil', quantity: 2, unit: 'tbsp' },
    { id: 'soffritto', name: 'soffritto (onion, carrot, celery), finely diced', quantity: 250, unit: 'g' },
    { id: 'beef', name: 'ground beef', quantity: 400, unit: 'g' },
    { id: 'pork', name: 'ground pork', quantity: 200, unit: 'g' },
    { id: 'tomato', name: 'tomato passata', quantity: 700, unit: 'g' },
    { id: 'milk', name: 'whole milk', quantity: 200, unit: 'ml' },
    { id: 'wine', name: 'dry white wine', quantity: 150, unit: 'ml' },
    { id: 'stock', name: 'beef stock', quantity: 250, unit: 'ml' },
    { id: 'bay', name: 'bay leaf', quantity: 1, unit: 'piece' },
    { id: 'salt', name: 'salt', quantity: 1, unit: 'tsp' },
    { id: 'pepper', name: 'black pepper', quantity: 0.5, unit: 'tsp' },
  ],
  steps: [
    { order: 1, text: 'Warm {q:2,u:"tbsp",n:"olive oil"} in a heavy pot over medium heat; add the soffritto and cook until soft.' },
    { order: 2, text: 'Add {q:400,u:"g",n:"ground beef"} and {q:200,u:"g",n:"ground pork"}; brown well, breaking up lumps.' },
    { order: 3, text: 'Deglaze with {q:150,u:"ml",n:"dry white wine"} and reduce by half.' },
    { order: 4, text: 'Stir in {q:700,u:"g",n:"tomato passata"}, {q:250,u:"ml",n:"beef stock"}, and {q:1,u:"piece",n:"bay leaf"}. Simmer gently 2–3 hours.' },
    { order: 5, text: 'Finish with {q:200,u:"ml",n:"whole milk"}; season with {q:1,u:"tsp",n:"salt"} and {q:0.5,u:"tsp",n:"black pepper"}.' },
  ],
  createdAt: '2025-08-17T00:00:00.000Z',
  updatedAt: '2025-08-17T00:00:00.000Z',
}

export default recipe

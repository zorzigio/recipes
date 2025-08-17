import type { Recipe } from '@/lib/schema'

const recipe: Recipe = {
  id: 'pasta-ragu',
  title: 'Pasta with Ragù',
  description: 'Tagliatelle tossed with rich Bolognese ragù and Parmesan.',
  image: '/images/pasta.jpg',
  tags: ['Italian', 'pasta'],
  baseServings: 4,
  totalMinutes: 20,
  difficulty: 'easy',
  ingredients: [
    { id: 'pasta', name: 'dried tagliatelle (or pasta of choice)', quantity: 400, unit: 'g' },
    { id: 'ragu', name: 'ragù alla bolognese (warmed)', quantity: 600, unit: 'g' },
    { id: 'parmesan', name: 'Parmigiano Reggiano, finely grated', quantity: 40, unit: 'g' },
    { id: 'salt', name: 'salt for pasta water', quantity: 1, unit: 'tbsp' },
    { id: 'water', name: 'water for boiling', quantity: 4, unit: 'l' },
  ],
  steps: [
    { order: 1, text: 'Bring {q:4,u:"l",n:"water"} to a rolling boil; salt with {q:1,u:"tbsp",n:"salt"}.' },
    { order: 2, text: 'Cook {q:400,u:"g",n:"dried tagliatelle"} until al dente; reserve some cooking water.' },
    { order: 3, text: 'Toss pasta with {q:600,u:"g",n:"ragù alla bolognese"}, loosening with cooking water as needed.' },
    { order: 4, text: 'Serve and top with {q:40,u:"g",n:"Parmigiano Reggiano, finely grated"}.' },
  ],
  createdAt: '2025-08-17T00:00:00.000Z',
  updatedAt: '2025-08-17T00:00:00.000Z',
}

export default recipe

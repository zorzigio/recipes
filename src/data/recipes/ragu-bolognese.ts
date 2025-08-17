import type { Recipe } from '@/lib/schema'

const recipe: Recipe = {
  id: 'ragu-bolognese',
  title: 'Ragù alla Bolognese',
  description: 'Classic slow-cooked meat sauce from Bologna, perfect with tagliatelle.',
  image: '/images/bolognese.png',
  tags: ['Italian', 'pasta', 'slow-cook'],
  baseServings: 4,
  totalMinutes: 180,
  difficulty: 'medium',
  ingredients: [
    { id: 'oil', name: 'extra-virgin olive oil', quantity: 3, unit: 'tbsp' },
    { id: 'onion', name: 'white onion, finely chopped', quantity: 1, unit: 'piece', notes: 'small' },
    { id: 'celery', name: 'celery, finely chopped', quantity: 70, unit: 'g' },
    { id: 'carrot', name: 'carrot, finely chopped', quantity: 70, unit: 'g' },
    { id: 'beef', name: 'ground beef (not too lean)', quantity: 600, unit: 'g' },
    { id: 'pork', name: 'ground pork (not too lean)', quantity: 250, unit: 'g' },
    { id: 'tomato', name: 'thick tomato passata', quantity: 700, unit: 'ml' },
    { id: 'wine', name: 'red wine', quantity: 100, unit: 'ml', notes: 'white is fine too' },
    { id: 'milk', name: 'whole milk', quantity: 50, unit: 'ml' },
    { id: 'rosemary', name: 'rosemary', quantity: 1, unit: 'sprig', notes: 'optional' },
    { id: 'salt', name: 'salt', quantity: 2, unit: 'pinch' },
    { id: 'pepper', name: 'black pepper', quantity: 1, unit: 'pinch' },
  ],
  steps: [
    { order: 1, text: 'Make a fine soffritto: chop onion, celery and carrot. Warm {q:3,u:"tbsp",n:"extra-virgin olive oil"} in a heavy pot over medium heat, add the vegetables and gently sauté until soft and sweet without browning (about 7–8 minutes).' },
    { order: 2, text: 'Add {q:600,u:"g",n:"ground beef"} and {q:250,u:"g",n:"ground pork"}; raise the heat and cook, breaking up the meat, until well browned and the juices evaporate.' },
    { order: 3, text: 'Pour in {q:100,u:"ml",n:"red wine"}; let the alcohol evaporate completely.' },
    { order: 4, text: 'Add {q:700,u:"ml",n:"thick tomato passata"} and a little water to rinse the bottle. Add {q:1,u:"sprig",n:"rosemary"} if using. Bring to a gentle simmer.' },
    { order: 5, text: 'Cook very slowly for about 3 hours, partially covered, stirring from time to time. If it dries too much, add a splash of water to keep it creamy.' },
    { order: 6, text: 'In the last 10 minutes stir in {q:50,u:"ml",n:"whole milk"} to round the acidity. Season with {q:2,u:"pinch",n:"salt"} and {q:1,u:"pinch",n:"black pepper"} to taste. Remove the rosemary.' },
    { order: 7, text: 'Let the ragù rest a few minutes before serving with tagliatelle or using for lasagne.' },
  ],
  createdAt: '2025-08-17T00:00:00.000Z',
  updatedAt: '2025-08-18T00:00:00.000Z',
}

export default recipe

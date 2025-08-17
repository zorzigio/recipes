import type { Recipe } from '@/lib/schema'

const recipe: Recipe = {
  id: 'tiramisu',
  title: 'Tiramisù',
  description: 'Layers of espresso-soaked ladyfingers and mascarpone cream, dusted with cocoa.',
  image: '/images/tiramisu.png',
  tags: ['Italian', 'dessert', 'no-bake'],
  baseServings: 6,
  totalMinutes: 40,
  difficulty: 'easy',
  ingredients: [
    { id: 'espresso', name: 'unsweetened coffee, cooled', quantity: 300, unit: 'ml' },
    { id: 'ladyfingers', name: 'savoiardi (ladyfingers)', quantity: 300, unit: 'g' },
    { id: 'mascarpone', name: 'mascarpone', quantity: 500, unit: 'g' },
    { id: 'eggs', name: 'eggs, separated', quantity: 4, unit: 'piece' },
    { id: 'sugar', name: 'caster sugar', quantity: 100, unit: 'g' },
    { id: 'cocoa', name: 'unsweetened cocoa powder', quantity: 2, unit: 'tbsp' },
  ],
  steps: [
    { order: 1, text: 'Brew {q:300,u:"ml",n:"unsweetened coffee"} and let it cool completely (cold coffee helps prevent soggy biscuits).' },
    { order: 2, text: 'Separate the {q:4,u:"piece",n:"eggs"} into yolks and whites.' },
    { order: 3, text: 'Whisk yolks with {q:100,u:"g",n:"caster sugar"} until the mixture is pale, thick, and airy.' },
    { order: 4, text: 'Add {q:500,u:"g",n:"mascarpone"} (slightly softened) to the yolk mixture and mix just until smooth.' },
    { order: 5, text: 'In a clean bowl, whip the egg whites to stiff peaks.' },
    { order: 6, text: 'Gently fold the whipped whites into the mascarpone cream, working from bottom to top to keep the mixture fluffy.' },
    { order: 7, text: 'Spread a thin layer of cream on the bottom of a ~20x20 cm dish to help the first layer adhere.' },
    { order: 8, text: 'Quickly dip each savoiardo (smooth side) in the cold coffee—just a brief dip—and arrange them in a single layer without overlapping.' },
    { order: 9, text: 'Cover the biscuits with a generous layer of cream, smoothing the surface.' },
    { order: 10, text: 'Repeat with a second layer of briefly dipped savoiardi.' },
    { order: 11, text: 'Finish with the remaining cream and level the top.' },
    { order: 12, text: 'Refrigerate for about 3 hours (longer rest improves texture and flavor).' },
    { order: 13, text: 'Just before serving, dust the surface evenly with {q:2,u:"tbsp",n:"unsweetened cocoa powder"}.' },
  ],
  createdAt: '2025-08-17T00:00:00.000Z',
  updatedAt: '2025-08-17T00:00:00.000Z',
}

export default recipe

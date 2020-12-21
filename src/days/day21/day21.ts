import {readFile} from '../../common/file';

interface Food {
  ingredients: string[];
  allergens: string[];
}

const allAllergens = new Set<string>();
const allIngredients = new Set<string>();

const ingredientCounts = new Map<string, number>();

function partOne(foods: Food[]) {
  // key is the ingredient name, value is a list of allergens it cannot be for
  const notAllergen = new Map<string, Set<string>>();

  for (const food of foods) {
    const {ingredients, allergens} = food;
    for (const ingredient of Array.from(allIngredients.values())) {
      // for the ingredients not listed here, the listed allergens can
      // definitely not be associated with those ingredients
      if (!ingredients.includes(ingredient)) {
        const current = notAllergen.get(ingredient) || new Set<string>();
        allergens.forEach(allergen => current.add(allergen));
        notAllergen.set(ingredient, current);
      }
    }
  }

  return Array.from(notAllergen.entries())
      .filter(entry => {
        const [ingredient, allergens] = entry;
        return allergens.size === allAllergens.size;
      })
      .map(entry => {
        const [ingredient, allergens] = entry;
        return ingredientCounts.get(ingredient);
      })
      .reduce((a, b) => a + b);
}

function partTwo(foods: Food[]) {
  // key is the ingredient name, value is a list of allergens it cannot be for
  const notAllergen = new Map<string, Set<string>>();

  // build up the map of allergens that cannot be associated with each
  // ingredient. any ingredient not listed for a particular food that has
  // allergens cannot be responsible for that allergen
  for (const food of foods) {
    const {ingredients, allergens} = food;
    for (const ingredient of Array.from(allIngredients.values())) {
      // for the ingredients not listed here, the listed allergens can
      // definitely not be associated with those ingredients
      if (!ingredients.includes(ingredient)) {
        const current = notAllergen.get(ingredient) || new Set<string>();
        allergens.forEach(allergen => current.add(allergen));
        notAllergen.set(ingredient, current);
      }
    }
  }

  // determine which ingredients are safe using the map of ingredients to
  // allergens that it cannot be associated with
  const safeIngredients = Array.from(notAllergen.entries())
                              .filter(entry => {
                                const [ingredient, allergens] = entry;
                                return allergens.size === allAllergens.size;
                              })
                              .map(entry => {
                                const [ingredient, allergens] = entry;
                                return ingredient;
                              });

  const allergens = Array.from((allAllergens.values()));

  // given which ones are safe, find the remaining indredients that must be
  // responsible for these allergens
  const remainingIngredients =
      Array.from(allIngredients.values())
          .filter(ingredient => !safeIngredients.includes(ingredient))
          .map(ingredient => {
            const nonAllergens = notAllergen.get(ingredient);
            const filtered =
                allergens.filter(allergen => !nonAllergens.has(allergen));
            return {ingredient, allergens: filtered};
          })
          .sort((a, b) => a.allergens.length - b.allergens.length);

  // for each ingredient, if it is only associated with one allergen, save that
  // pair, and make sure the other ingredients don't use it
  const pairedAllergens = [];
  const finalIngredientPairs = [];
  while (remainingIngredients.length) {
    for (let i = 0; i < remainingIngredients.length; i++) {
      const {ingredient, allergens} = remainingIngredients[i];
      const filtered = allergens.filter(a => !pairedAllergens.includes(a));
      if (filtered.length === 1) {
        const allergen = filtered[0];
        pairedAllergens.push(allergen);
        finalIngredientPairs.push({ingredient, allergen});
        remainingIngredients.splice(i, 1);
      }
    }
  }

  return finalIngredientPairs.sort((a, b) => a.allergen < b.allergen ? -1 : 1)
      .map(a => a.ingredient)
      .join(',');
}

function parseInput(): Food[] {
  return readFile().map(line => {
    const split = line.split(' (contains ');
    const ingredients = split[0].split(' ');
    const allergens = split[1].split(')')[0].split(', ');

    ingredients.forEach(ingredient => {
      allIngredients.add(ingredient);

      let count = ingredientCounts.get(ingredient) || 0;
      ingredientCounts.set(ingredient, count + 1);
    });
    allergens.forEach(allergen => allAllergens.add(allergen));

    return {ingredients, allergens};
  });
}

const foods = parseInput();
console.log(partOne(foods));
console.log(partTwo(foods));
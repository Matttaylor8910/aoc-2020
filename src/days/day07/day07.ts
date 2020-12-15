import {readFile} from '../../common/file';

interface Bag {
  name: string;
  // a map of bagnames to number of that bag you can have
  bags: Map<string, number>;
}

const bagMap = new Map<string, Bag>();

function partOne() {
  return Array.from(bagMap.values()).filter(canHaveShinyGold).length;
}

function canHaveShinyGold(bag: Bag) {
  // found it!
  if (bag.bags.has('shiny gold')) {
    return true;
  }

  // keep recursively searching
  return Array.from(bag.bags.keys()).some(key => {
    return bagMap.has(key) && canHaveShinyGold(bagMap.get(key));
  });
}

function partTwo() {
  return bagsInside(bagMap.get('shiny gold'));
}

function bagsInside(bag: Bag): number {
  return Array.from(bag.bags.keys())
      .map(key => {
        const thisBag = bagMap.get(key);
        if (!thisBag) {
          return 0;
        }
        return bag.bags.get(key) * (bagsInside(thisBag) + 1);
      })
      .reduce((a, b) => a + b, 0);
}

function parseFileAndBuildBagMap() {
  readFile().forEach(line => {
    const split = line.split(' bags contain ');
    const bag = {name: split[0], bags: new Map<string, number>()};

    split[1].split(', ').forEach(bagPart => {
      const spaceSplit = bagPart.split(' ');
      const count = Number(spaceSplit[0]);
      if (isNaN(count)) {
        return;
      }
      const name = spaceSplit.slice(1, spaceSplit.length - 1).join(' ');
      bag.bags.set(name, count);
    });

    bagMap.set(bag.name, bag);
  });
}

parseFileAndBuildBagMap();
console.log(partOne());
console.log(partTwo());
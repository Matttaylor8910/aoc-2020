import fs = require('fs');

interface Bag {
  name: string;
  // a map of bagnames to number of that bag you can have
  bags: {[bagName: string]: number};
}

const bagMap: {[name: string]: Bag} = {};

function partOne() {
  return Object.values(bagMap).filter(canHaveShinyGold).length;
}

function canHaveShinyGold(bag: Bag) {
  // found it!
  if (bag.bags['shiny gold']) {
    return true;
  }

  // keep recursively searching
  return Object.keys(bag.bags).some(key => {
    return bagMap[key] && canHaveShinyGold(bagMap[key]);
  });
}

function partTwo() {
  return bagsInside(bagMap['shiny gold']);
}

function bagsInside(bag: Bag): number {
  return Object.keys(bag.bags)
      .map(key => {
        const thisBag = bagMap[key];
        if (!thisBag) {
          return 0;
        }
        return bag.bags[key] * (bagsInside(thisBag) + 1);
      })
      .reduce((a, b) => a + b, 0);
}

function parseFileAndBuildBagMap() {
  fs.readFileSync('day07/day07.txt', 'utf8').split('\n').forEach(line => {
    const split = line.split(' bags contain ');
    const bag = {name: split[0], bags: {}};

    split[1].split(', ').forEach(bagPart => {
      const spaceSplit = bagPart.split(' ');
      const count = Number(spaceSplit[0]);
      if (isNaN(count)) {
        return;
      }
      const name = spaceSplit.slice(1, spaceSplit.length - 1).join(' ');
      bag.bags[name] = count;
    });

    bagMap[bag.name] = bag;
  });
}

parseFileAndBuildBagMap();
console.log(partOne());
console.log(partTwo());
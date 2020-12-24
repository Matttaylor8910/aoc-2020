import {readFile} from '../../common/file';

const twos = ['se', 'sw', 'ne', 'nw'];

function partOne(operations: string[][]) {
  return countBlack(performOperations(operations));
}

function partTwo(operations: string[][]) {
  const flipped = performOperations(operations);
  addNeighbors(flipped);

  const finish = 100;
  let day = 1;
  while (day <= finish) {
    performFlips(flipped);
    addNeighbors(flipped);
    day++;
  }

  return countBlack(flipped);
}

function addNeighbors(flipped: Map<string, boolean>) {
  for (const tileKey of Array.from(flipped.keys())) {
    const {h, v} = getHV(tileKey);
    const neighbors = [
      getKey(h + .5, v + 1),
      getKey(h - .5, v + 1),
      getKey(h + 1, v),
      getKey(h + .5, v - 1),
      getKey(h - .5, v - 1),
      getKey(h - 1, v),
    ];
    for (const neighbor of neighbors) {
      flipped.set(neighbor, flipped.get(neighbor) || false);
    }
  }
}

function performFlips(flipped: Map<string, boolean>) {
  const toSet = [];

  for (const tileKey of Array.from(flipped.keys())) {
    const {h, v} = getHV(tileKey);
    const current = flipped.get(tileKey);

    const neighbors =
        [
          flipped.get(getKey(h + .5, v + 1)),
          flipped.get(getKey(h - .5, v + 1)),
          flipped.get(getKey(h + 1, v)),
          flipped.get(getKey(h + .5, v - 1)),
          flipped.get(getKey(h - .5, v - 1)),
          flipped.get(getKey(h - 1, v)),
        ].filter(tile => !!tile)
            .length;

    // black
    if (current) {
      if (neighbors === 0 || neighbors > 2) {
        toSet.push({tileKey, set: false});
      }
    }

    // white
    else {
      if (neighbors === 2) {
        toSet.push({tileKey, set: true});
      }
    }
  }

  toSet.forEach((({tileKey, set}) => flipped.set(tileKey, set)));
}

function getHV(key: string) {
  const [h, v] = key.split('_').map(Number);
  return {h, v};
}

function getKey(h: number, v: number) {
  return `${h}_${v}`;
}

function countBlack(flipped: Map<string, boolean>) {
  return Array.from(flipped.values()).filter(bool => !!bool).length;
}

function performOperations(operations: string[][]): Map<string, boolean> {
  const flipped = new Map<string, boolean>();
  let h = 0;
  let v = 0;

  for (const line of operations) {
    for (const direction of line) {
      if (direction === 'se') {
        h += .5;
        v++;
      } else if (direction === 'sw') {
        h -= .5;
        v++;
      } else if (direction === 'e') {
        h++;
      } else if (direction === 'ne') {
        h += .5;
        v--;
      } else if (direction === 'nw') {
        h -= .5;
        v--;
      } else if (direction === 'w') {
        h--;
      }
    }

    const key = getKey(h, v);
    flipped.set(key, !flipped.get(key));

    h = 0;
    v = 0;
  }

  return flipped;
}

function parseInput(): string[][] {
  return readFile().map(line => {
    const split = line.split('');
    const operations = [];

    while (split.length) {
      // one of the two letter directions
      if (twos.includes(split.slice(0, 2).join(''))) {
        operations.push(split.splice(0, 2).join(''));
      } else {
        operations.push(...split.splice(0, 1));
      }
    }

    return operations;
  });
}

const operations = parseInput();
console.log(partOne(operations));
console.log(partTwo(operations));
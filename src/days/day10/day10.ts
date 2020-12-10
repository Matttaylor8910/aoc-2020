import fs = require('fs');

const MAX_DIFFERENCE = 3;

function partOne(adapters: number[]) {
  const diffs = {};
  for (let i = 1; i < adapters.length; i++) {
    const diff = adapters[i] - adapters[i - 1];
    diffs[diff] = (diffs[diff] || 0) + 1;
  }
  return diffs[1] * diffs[3];
}

function partTwo(adapters: number[]) {
  return getPaths(0, 0, adapters, {});
}

function getPaths(
    index: number,
    currentJolts: number,
    adapters: number[],
    map: {[hash: string]: number},
) {
  // only 1 adapter? only one path
  if (adapters.length === 1) return 1;

  // look for stored result for this set of adapters
  if (map[index]) return map[index];

  // new set, count paths for valid next adapters
  let paths = 0;
  const maxJolts = currentJolts + MAX_DIFFERENCE;
  for (let i = 0; i < MAX_DIFFERENCE && i < adapters.length; i++) {
    const next = adapters[i];
    if (currentJolts < next && next <= maxJolts) {
      paths += getPaths(index + i + 1, next, adapters.slice(i + 1), map);
    }
  }

  // store and return
  map[index] = paths;
  return paths;
}

function parseInput(): number[] {
  const adapters = fs.readFileSync('src/days/day10/day10.txt', 'utf8')
                       .split('\n')
                       .map(line => {
                         return Number(line);
                       })
                       .sort((a, b) => a - b);

  // add the imaginary (0) and (max + 3) to the ends of the array
  adapters.unshift(0);
  adapters.push(adapters[adapters.length - 1] + MAX_DIFFERENCE);
  return adapters;
}

const adapters = parseInput();
console.log(partOne(adapters));
console.log(partTwo(adapters));
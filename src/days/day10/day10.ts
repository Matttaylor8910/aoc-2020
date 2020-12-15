import {readFile} from '../../common/file';

const MAX_DIFFERENCE = 3;

function partOne(adapters: number[]) {
  const diffs = new Map<number, number>();
  for (let i = 1; i < adapters.length; i++) {
    const diff = adapters[i] - adapters[i - 1];
    diffs.set(diff, (diffs.get(diff) || 0) + 1);
  }
  return diffs.get(1) * diffs.get(3);
}

function partTwo(adapters: number[]) {
  return getPaths(0, 0, adapters, new Map());
}

function getPaths(
    index: number,
    currentJolts: number,
    adapters: number[],
    map: Map<number, number>,
) {
  // only 1 adapter? only one path
  if (adapters.length === 1) return 1;

  // look for stored result for this set of adapters
  if (map.has(index)) return map.get(index);

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
  map.set(index, paths);
  return paths;
}

function parseInput(): number[] {
  const adapters = readFile().map(Number).sort((a, b) => a - b);

  // add the imaginary (0) and (max + 3) to the ends of the array
  adapters.unshift(0);
  adapters.push(adapters[adapters.length - 1] + MAX_DIFFERENCE);
  return adapters;
}

const adapters = parseInput();
console.log(partOne(adapters));
console.log(partTwo(adapters));
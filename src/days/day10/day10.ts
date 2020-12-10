import fs = require('fs');

function partOne(adapters: number[]) {
  let ones = 0;
  let threes = 0;
  for (let i = 1; i < adapters.length; i++) {
    const diff = adapters[i] - adapters[i - 1];
    if (diff === 1) {
      ones++;
    } else if (diff === 3) {
      threes++;
    }
  }
  return ones * threes;
}

function partTwo(adapters: number[], maxDifference: number) {
  return getPaths(0, adapters, maxDifference, {});
}

function getPaths(
    currentJolts: number,
    adapters: number[],
    maxDifference: number,
    map: {[hash: string]: number},
) {
  // only 1 adapter? only one path
  if (adapters.length === 1) return 1;

  // look for stored result for this set of adapters
  const hash = adapters.join('_');
  if (map[hash]) return map[hash];

  // new set, count paths for valid next adapters
  let answer = 0;
  const maxJolts = currentJolts + maxDifference;
  for (let i = 0; i < maxDifference && i < adapters.length; i++) {
    const next = adapters[i];
    if (currentJolts < next && next <= maxJolts) {
      answer += getPaths(next, adapters.slice(i + 1), maxDifference, map);
    }
  }

  // store and return
  map[hash] = answer;
  return answer;
}

function parseInput(): number[] {
  return fs.readFileSync('src/days/day10/day10.txt', 'utf8')
      .split('\n')
      .map(line => {
        return Number(line);
      })
      .sort((a, b) => a - b);
}

const maxDifference = 3;
const adapters = parseInput();
// add the imaginary (0) and (max + 3) to the ends of the array
adapters.unshift(0);
adapters.push(adapters[adapters.length - 1] + maxDifference);

console.log(partOne(adapters));
console.log(partTwo(adapters, maxDifference));
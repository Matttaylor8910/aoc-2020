import {readFile} from '../../common/file';

interface Route {
  id: number;
  offset: number;
}

interface Congruence {
  remainder: number;
  mod: number;
}

function partOne(arrival: number, routes: Route[]): number {
  let current = arrival;
  while (true) {
    for (const route of routes) {
      if (current % route.id === 0) {
        return route.id * (current - arrival);
      }
    }
    current++;
  }
}

function partTwo(routes: Route[]): number {
  const congruences = routes.map(route => {
    const {id: mod, offset} = route;
    let remainder = (((mod - offset) % mod) + mod) % mod;
    return {remainder, mod};
  });
  return chineseRemainderTheorum(congruences);
}

function chineseRemainderTheorum(congruences: Congruence[]): number {
  let total = 0;
  const product = congruences.map(a => a.mod).reduce((a, b) => a * b);

  for (let i = 0; i < congruences.length; i++) {
    const {remainder, mod} = congruences[i];
    let result = product / mod;
    let offset = result % mod;
    let multiple = 1;
    while (offset * multiple % mod !== remainder) {
      multiple++;
    }
    total += result * multiple;
  }

  return total % product;
}

function parseInput(): {arrival: number, routes: Route[]} {
  const lines = readFile();
  return {
    arrival: Number(lines[0]),
    routes: lines[1]
                .split(',')
                .map((id, offset) => {
                  return {id: Number(id), offset};
                })
                .filter(route => !isNaN(route.id))
  };
}

const {arrival, routes} = parseInput();
console.log(partOne(arrival, routes));
console.log(partTwo(routes));
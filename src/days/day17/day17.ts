import {readFile} from '../../common/file';

function partOne() {
  // space will be the 3d space as a 2 dimensional type of grid
  let cubes = new Map<string, string>();

  let x = 0;
  readFile().forEach(line => {
    for (let y = 0; y < line.length; y++) {
      cubes.set(getKeyPartOne(x, y, 0), line[y]);
    }
    x++;
  });

  for (let cycle = 0; cycle < 6; cycle++) {
    const newCubes = new Map();

    for (const key of Array.from(cubes.keys())) {
      addNearbyNeighborsPartOne(key, cubes);
    }

    for (const key of Array.from(cubes.keys())) {
      const state = cubes.get(key);
      const active = countActiveNeighborsPartOne(key, cubes);

      if (state === '#') {
        if ([2, 3].includes(active)) {
          newCubes.set(key, '#');
        } else {
          newCubes.set(key, '.');
        }
      } else {
        if (active === 3) {
          newCubes.set(key, '#');
        } else {
          newCubes.set(key, '.');
        }
      }
    }

    cubes = newCubes;
  }

  return Array.from(cubes.values()).filter(state => state === '#').length;
}

function countActiveNeighborsPartOne(key: string, cubes: Map<string, string>) {
  const {x, y, z} = fromKeyPartOne(key);
  let count = 0;
  for (let x1 = x - 1; x1 < x + 2; x1++) {
    for (let y1 = y - 1; y1 < y + 2; y1++) {
      for (let z1 = z - 1; z1 < z + 2; z1++) {
        const neighbor = getKeyPartOne(x1, y1, z1);

        if (neighbor !== key) {
          const current = cubes.get(neighbor);

          if (current === '#') {
            count++;
          }
        }
      }
    }
  }
  return count;
}

function addNearbyNeighborsPartOne(key: string, cubes: Map<string, string>) {
  const {x, y, z} = fromKeyPartOne(key);
  for (let x1 = x - 1; x1 < x + 2; x1++) {
    for (let y1 = y - 1; y1 < y + 2; y1++) {
      for (let z1 = z - 1; z1 < z + 2; z1++) {
        const neighbor = getKeyPartOne(x1, y1, z1);

        if (neighbor !== key) {
          const current = cubes.get(neighbor);

          if (current === undefined) {
            cubes.set(neighbor, '.');
          }
        }
      }
    }
  }
}

function getKeyPartOne(x, y, z) {
  return `${x},${y},${z}`;
}

function fromKeyPartOne(string) {
  const split = string.split(',').map(Number);
  return {x: split[0], y: split[1], z: split[2]};
}

console.log(partOne());

function partTwo() {
  // space will be the 3d space as a 2 dimensional type of grid
  let cubes = new Map<string, string>();

  let x = 0;
  readFile().forEach(line => {
    for (let y = 0; y < line.length; y++) {
      cubes.set(getKeyPartTwo(x, y, 0, 0), line[y]);
    }
    x++;
  });

  for (let cycle = 0; cycle < 6; cycle++) {
    const newCubes = new Map();

    for (const key of Array.from(cubes.keys())) {
      addNearbyNeighborsPartTwo(key, cubes);
    }

    for (const key of Array.from(cubes.keys())) {
      const state = cubes.get(key);
      const active = countActiveNeighborsPartTwo(key, cubes);

      if (state === '#') {
        if ([2, 3].includes(active)) {
          newCubes.set(key, '#');
        } else {
          newCubes.set(key, '.');
        }
      } else {
        if (active === 3) {
          newCubes.set(key, '#');
        } else {
          newCubes.set(key, '.');
        }
      }
    }

    cubes = newCubes;
  }

  return Array.from(cubes.values()).filter(state => state === '#').length;
}

function countActiveNeighborsPartTwo(key: string, cubes: Map<string, string>) {
  const {x, y, z, w} = fromKeyPartTwo(key);
  let count = 0;
  for (let x1 = x - 1; x1 < x + 2; x1++) {
    for (let y1 = y - 1; y1 < y + 2; y1++) {
      for (let z1 = z - 1; z1 < z + 2; z1++) {
        for (let w1 = w - 1; w1 < w + 2; w1++) {
          const neighbor = getKeyPartTwo(x1, y1, z1, w1);

          if (neighbor !== key) {
            const current = cubes.get(neighbor);

            if (current === '#') {
              count++;
            }
          }
        }
      }
    }
  }
  return count;
}

function addNearbyNeighborsPartTwo(key: string, cubes: Map<string, string>) {
  const {x, y, z, w} = fromKeyPartTwo(key);
  for (let x1 = x - 1; x1 < x + 2; x1++) {
    for (let y1 = y - 1; y1 < y + 2; y1++) {
      for (let z1 = z - 1; z1 < z + 2; z1++) {
        for (let w1 = w - 1; w1 < w + 2; w1++) {
          const neighbor = getKeyPartTwo(x1, y1, z1, w1);

          if (neighbor !== key) {
            const current = cubes.get(neighbor);

            if (current === undefined) {
              cubes.set(neighbor, '.');
            }
          }
        }
      }
    }
  }
}

function getKeyPartTwo(x, y, z, w) {
  return `${x},${y},${z},${w}`;
}

function fromKeyPartTwo(string) {
  const split = string.split(',').map(Number);
  return {x: split[0], y: split[1], z: split[2], w: split[3]};
}

console.log(partTwo());
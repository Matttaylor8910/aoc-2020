import {readFile} from '../../common/file';
import {Grid} from '../../common/grid';

enum Space {
  FLOOR = '.',
  EMPTY = 'L',
  OCCUPIED = '#',
}

function partOne(grid: Grid) {
  let lastHash;

  while (lastHash !== grid.toString()) {
    lastHash = grid.toString();
    const newGrid = grid.clone();

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const map = grid.getNeighborMap(r, c);
        const current = grid.getCell(r, c);
        const occupied = map.get(Space.OCCUPIED) || 0;
        if (current === Space.EMPTY && occupied === 0) {
          newGrid.setCell(r, c, Space.OCCUPIED);
        } else if (current === Space.OCCUPIED && occupied >= 4) {
          newGrid.setCell(r, c, Space.EMPTY);
        }
      }
    }

    grid = newGrid;
  }

  return grid.count(Space.OCCUPIED);
}

function partTwo(grid: Grid) {
  let lastHash;

  while (lastHash !== grid.toString()) {
    lastHash = grid.toString();
    const newGrid = grid.clone();

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        const map = grid.getNeighborMap(r, c, [Space.FLOOR]);
        const current = grid.getCell(r, c);
        const occupied = map.get(Space.OCCUPIED) || 0;
        if (current === Space.EMPTY && occupied === 0) {
          newGrid.setCell(r, c, Space.OCCUPIED);
        } else if (current === Space.OCCUPIED && occupied >= 5) {
          newGrid.setCell(r, c, Space.EMPTY);
        }
      }
    }

    grid = newGrid;
  }

  return grid.count(Space.OCCUPIED);
}

function parseInput(): string[][] {
  return readFile().map(line => line.split(''));
}

const grid = new Grid(parseInput());
console.log(partOne(grid.clone()));
console.log(partTwo(grid.clone()));
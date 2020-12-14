import {readFile} from '../../common/file';

enum Square {
  OPEN = '.',
  TREE = '#',
}

function partOne(rows: string[][], right: number, down: number): number {
  let trees = 0;
  let col = right;

  for (let row = down; row < rows.length; row += down) {
    if (rows[row][col % rows[0].length] === Square.TREE) {
      trees++;
    }
    col += right;
  }

  return trees;
}

function partTwo(rows: string[][]): number {
  return partOne(rows, 1, 1) * partOne(rows, 3, 1) * partOne(rows, 5, 1) *
      partOne(rows, 7, 1) * partOne(rows, 1, 2);
}

function parseInput(): string[][] {
  return readFile().map(row => row.split(''));
}

const rows = parseInput();
console.log(partOne(rows, 3, 1));
console.log(partTwo(rows));
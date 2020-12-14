import {readFile} from '../../common/file';

const TARGET = 2020;

function partOne(numbers: number[]): string|number {
  for (const a of numbers) {
    for (const b of numbers) {
      if (a + b === TARGET) {
        return a * b;
      }
    }
  }
  return 'error';
}

function partTwo(numbers: number[]): string|number {
  for (const a of numbers) {
    for (const b of numbers) {
      for (const c of numbers) {
        if (a + b + c === TARGET) {
          return a * b * c;
        }
      }
    }
  }
  return 'error';
}

function parseInput(): number[] {
  return readFile().map(x => parseInt(x));
}

const numbers = parseInput();
console.log(partOne(numbers));
console.log(partTwo(numbers));
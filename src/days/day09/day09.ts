import {readFile} from '../../common/file';

function partOne(numbers: number[]) {
  for (let i = 25; i < numbers.length; i++) {
    const valid = isValid(numbers.slice(i - 25, i), numbers[i]);
    if (!valid) {
      return numbers[i];
    }
  }

  return 'error';
}

function isValid(subset: number[], sum: number) {
  for (let i = 0; i < subset.length; i++) {
    for (let j = 0; j < subset.length; j++) {
      if (i !== j && subset[i] + subset[j] === sum) {
        return true;
      }
    }
  }

  return false;
}

function partTwo(numbers: number[]) {
  const target = partOne(numbers);
  let current = 0;
  let set = [];

  for (let i = 0; i < numbers.length; i++) {
    current = numbers[i];
    set = [current];
    for (let j = i + 1; j < numbers.length; j++) {
      if (current === target) {
        return Math.max(...set) + Math.min(...set);
      } else if (current > target) {
        break;
      } else {
        current += numbers[j];
        set.push(numbers[j]);
      }
    }
  }
}

function parseInput(): number[] {
  return readFile().map(Number);
}

const numbers = parseInput();
console.log(partOne(numbers));
console.log(partTwo(numbers));
import {readFile} from '../../common/file';
import {add} from '../../common/math';

enum Char {
  SPACE = ' ',
  ADD = '+',
  MULTIPLY = '*',
  OPEN = '(',
  CLOSE = ')',
}

function partOne() {
  let total = '0';

  readFile().forEach(line => {
    // each key is the "level" startign at 0, each value is the current sum for
    // that level
    let sums = new Map<number, number>();
    let symbols = new Map<number, Char>();
    let level = 0;
    let current;
    let value;
    let symbol;
    for (let i = 0; i < line.length; i++) {
      switch (line[i]) {
        case Char.SPACE:
          break;
        case Char.ADD:
          symbols.set(level, Char.ADD);
          break;
        case Char.MULTIPLY:
          symbols.set(level, Char.MULTIPLY);
          break;
        case Char.OPEN:
          level++;
          sums.set(level, undefined);
          break;
        case Char.CLOSE:
          value = sums.get(level);
          level--;
          current = sums.get(level);
          symbol = symbols.get(level);
          if (symbol === undefined) {
            sums.set(level, value);
          } else if (symbol === Char.MULTIPLY) {
            sums.set(level, (current || 1) * value);
          } else if (symbol === Char.ADD) {
            sums.set(level, (current || 0) + value);
          }
          break;
        default:
          current = sums.get(level);
          value = Number(line[i]);
          symbol = symbols.get(level);
          if (symbol === undefined) {
            sums.set(level, value);
          } else if (symbol === Char.MULTIPLY) {
            sums.set(level, (current || 1) * value);
          } else if (symbol === Char.ADD) {
            sums.set(level, (current || 0) + value);
          }
          break;
      }
    }

    total = add(total, `${sums.get(0)}`);
  });

  return total;
}

function partTwo() {
  return readFile().map(line => `${findSum(line)}`).reduce((a, b) => add(a, b));
}


function findSum(line: string): number {
  let i = 0;

  while (i < line.length) {
    let value = line[i];

    // reduce parens to the sum inside them, then carry on with the logic
    if (value === Char.OPEN) {
      const start = i + 1;
      let count = 1;
      let end;
      for (let j = start; j < line.length; j++) {
        if (line[j] === Char.CLOSE) {
          count--;
        } else if (line[j] === Char.OPEN) {
          count++;
        }

        if (count === 0) {
          end = j;
          break;
        }
      }

      value = `${findSum(line.substring(start, end))}`;
      line = `${line.substring(0, i - 1)} ${value} ${
          line.substring(end + 1, line.length)}`;

      i = 0;
      continue;
    }

    i++;
  }

  return doMath(line);
}

function doMath(line: string): number {
  if (line.includes('+')) {
    // do stuff with +
    let tokens = line.replace(/  +/g, ' ').trim().split(' ');
    let i = 0;
    while (i < tokens.length) {
      if (tokens[i] === Char.ADD) {
        const sum = add(tokens[i - 1], tokens[i + 1]);
        tokens.splice(i - 1, 3, sum)
        i = 0;
        continue;
      }
      i++;
    }
    line = tokens.join(' ');
  }

  return eval(line);
}

console.log(partOne());
console.log(partTwo());
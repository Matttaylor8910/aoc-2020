import {readFile} from '../../common/file';

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

/** Combine two strings, from the internet */
function add(str1, str2) {
  let sum = '';  // our result will be stored in a string.

  // we'll need these in the program many times.
  let str1Length = str1.length;
  let str2Length = str2.length;

  // if s2 is longer than s1, swap them.
  if (str2Length > str1Length) {
    let temp = str2;
    str2 = str1;
    str1 = temp;
  }

  let carry =
      0;  // number that is carried to next decimal place, initially zero.
  let a;
  let b;
  let temp;
  let digitSum;
  for (let i = 0; i < str1.length; i++) {
    a = parseInt(str1.charAt(
        str1.length - 1 -
        i));  // get ith digit of str1 from right, we store it in a
    b = parseInt(str2.charAt(
        str2.length - 1 -
        i));          // get ith digit of str2 from right, we store it in b
    b = (b) ? b : 0;  // make sure b is a number, (this is useful in case, str2
                      // is shorter than str1
    temp = (carry + a + b).toString();  // add a and b along with carry, store
                                        // it in a temp string.
    digitSum = temp.charAt(temp.length - 1);  //
    carry = parseInt(temp.substr(
        0, temp.length - 1));     // split the string into carry and digitSum (
                                  // least significant digit of abSum.
    carry = (carry) ? carry : 0;  // if carry is not number, make it zero.

    sum = (i === str1.length - 1) ?
        temp + sum :
        digitSum + sum;  // append digitSum to 'sum'. If we reach leftmost
                         // digit, append abSum which includes carry too.
  }

  return sum;  // return sum
}

console.log(partOne());
console.log(partTwo());
import fs = require('fs');
import {cloneDeep} from 'lodash';

enum Operation {
  ACC = 'acc',
  JMP = 'jmp',
  NOP = 'nop',
}

interface Instruction {
  op: Operation;
  arg: number;
}

let accumulator = 0;
let counter = 0;

function partOne(instructions: Instruction[]):
    {success: boolean, accumulator: number} {
  const ran = new Set();
  accumulator = 0;
  counter = 0;

  while (counter < instructions.length) {
    let {op, arg} = instructions[counter];

    if (ran.has(counter)) {
      return {success: false, accumulator};
    } else {
      ran.add(counter);
    }

    // console.log(`running ${op} ${arg}`)
    switch (op) {
      case Operation.ACC:
        accumulator += arg;
        counter++;
        break;
      case Operation.JMP:
        counter += arg;
        break;
      case Operation.NOP:
        counter++;
        break;
      default:
        console.log(`UNSUPPORTED: ${op} ${arg}`);
        break;
    }
  }

  return {success: true, accumulator};
}

function partTwo(instructions: Instruction[]) {
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].op === Operation.JMP) {
      const cloned = cloneDeep(instructions);
      cloned[i].op = Operation.NOP;
      const {success, accumulator} = partOne(cloned);
      if (success) {
        return accumulator;
      }
    }

    else if (instructions[i].op === Operation.NOP) {
      const cloned = cloneDeep(instructions);
      cloned[i].op = Operation.JMP;
      const {success, accumulator} = partOne(cloned);
      if (success) {
        return accumulator;
      }
    }
  }

  return 'error';
}

function parseInput(): Instruction[] {
  return fs.readFileSync('day08/day08.txt', 'utf8').split('\n').map(line => {
    const split = line.split(' ');
    return {op: split[0] as Operation, arg: Number(split[1])};
  });
}

const instructions = parseInput();
console.log(partOne(instructions));
console.log(partTwo(instructions));
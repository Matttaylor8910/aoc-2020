import fs = require('fs');
import {cloneDeep} from 'lodash';
import {Operation, Instruction, run} from '../../common/computer';

function partTwo(instructions: Instruction[]) {
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i].op === Operation.JMP) {
      const cloned = cloneDeep(instructions);
      cloned[i].op = Operation.NOP;
      const {success, accumulator} = run(cloned);
      if (success) {
        return accumulator;
      }
    }

    else if (instructions[i].op === Operation.NOP) {
      const cloned = cloneDeep(instructions);
      cloned[i].op = Operation.JMP;
      const {success, accumulator} = run(cloned);
      if (success) {
        return accumulator;
      }
    }
  }

  return 'error';
}

function parseInput(): Instruction[] {
  return fs.readFileSync('src/days/day08/day08.txt', 'utf8')
      .split('\n')
      .map(line => {
        const split = line.split(' ');
        return {op: split[0] as Operation, arg: Number(split[1])};
      });
}

const instructions = parseInput();
console.log(run(instructions));
console.log(partTwo(instructions));
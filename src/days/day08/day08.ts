import {cloneDeep} from 'lodash';

import {Instruction, Operation, run} from '../../common/computer';
import {readFile} from '../../common/file';

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
  return readFile().map(line => {
    const split = line.split(' ');
    return {op: split[0] as Operation, arg: Number(split[1])};
  });
}

const instructions = parseInput();
console.log(run(instructions).accumulator);
console.log(partTwo(instructions));
export enum Operation {
  ACC = 'acc',
  JMP = 'jmp',
  NOP = 'nop',
}

export interface Instruction {
  op: Operation;
  arg: number;
}

// program state
let accumulator: number;
let counter: number;
let ran: Set<number>;

export function run(instructions: Instruction[]):
    {success: boolean, accumulator: number} {
  resetState();

  // program runs until the last instruction has been run
  while (counter < instructions.length) {
    let {op, arg} = instructions[counter];

    // already seen this instruction before, throw an error and return state
    if (ran.has(counter)) {
      return {success: false, accumulator};
    }

    ran.add(counter);

    // handle instruction
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

  // program ran successfully, return state
  return {success: true, accumulator};
}

function resetState() {
  ran = new Set();
  accumulator = 0;
  counter = 0;
}
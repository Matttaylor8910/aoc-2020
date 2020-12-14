import {readFile} from '../../common/file';

interface PasswordPolicy {
  char: string;
  min: number;
  max: number;
  password: string;
}

function partOne(policies: PasswordPolicy[]): number {
  return policies
      .filter(policy => {
        const {password, min, max, char} = policy;
        const num = password.split('').filter(c => c === char).length;
        return num >= min && num <= max;
      })
      .length;
}

function partTwo(policies: PasswordPolicy[]): string|number {
  return policies
      .filter(policy => {
        const {password, min, max, char} = policy;
        return (password[min - 1] === char ? 1 : 0) +
            (password[max - 1] === char ? 1 : 0) ===
            1;
      })
      .length;
}

function parseInput(): PasswordPolicy[] {
  return readFile().map(x => {
    const split = x.split(' ');
    const minMax = split[0].split('-');

    return {
      char: split[1].split(':')[0],
      min: parseInt(minMax[0]),
      max: parseInt(minMax[1]),
      password: split[2],
    };
  });
}

const policies = parseInput();
console.log(partOne(policies));
console.log(partTwo(policies));
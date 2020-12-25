import {readFile} from '../../common/file';

const SUBJECT_NUMBER = 7;
const MOD = 20201227;

function partOne(): number {
  const [card, door] = readFile().map(Number);
  return transform(door, getLoopSize(card));
}

function transform(publicKey: number, loopSize: number): number {
  let value = 1;
  while (loopSize > 0) {
    value = (value * publicKey) % MOD;
    loopSize--;
  }
  return value;
}

function getLoopSize(publicKey: number): number {
  let value = 1;
  let loopSize = 0;
  while (value !== publicKey) {
    value = (value * SUBJECT_NUMBER) % MOD;
    loopSize++;
  }
  return loopSize;
}

console.log(partOne());
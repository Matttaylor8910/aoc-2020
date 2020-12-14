import {readFile} from '../../common/file';
import {toBinary} from '../../common/math';

function partOne() {
  let mask;
  const map: {[key: string]: number} = {};

  readFile().forEach(line => {
    if (line.includes('mask =')) {
      mask = line.split('mask = ')[1];
    } else {
      const key = line.split('[')[1].split(']')[0];
      const num = Number(line.split(' = ')[1]);
      const binary = toBinary(num);
      const afterMask = applyMask(binary, mask);
      map[key] = parseInt(afterMask, 2);
    }
  });

  return Object.values(map).reduce((a, b) => a + b);
}

function applyMask(binary: string, mask: string): string {
  let array = binary.split('');
  let result = new Array(36);

  for (let i = 0; i < mask.length; i++) {
    const m = mask[mask.length - 1 - i];
    const a = array[array.length - 1 - i] || '0';

    result[result.length - 1 - i] = m === 'X' ? a : m;
  }
  return result.join('');
}

function partTwo() {
  let mask;
  const map: {[key: string]: number} = {};

  readFile().forEach(line => {
    if (line.includes('mask =')) {
      mask = line.split('mask = ')[1];
    } else {
      const key = line.split('[')[1].split(']')[0];
      const num = Number(line.split(' = ')[1]);
      const binary = toBinary(key);
      getAddresses(binary, mask).forEach(address => {
        map[address] = num;
      });
    }
  });

  return Object.values(map).reduce((a, b) => a + b);
}

function getAddresses(binary: string, mask: string): number[] {
  const floater = applyMaskFloating(binary, mask);
  return applyNextFloat(floater).map(x => parseInt(x, 2));
}

function applyNextFloat(binary: string): string[] {
  if (!binary.includes('F')) {
    return [binary];
  } else {
    return applyNextFloat(binary.replace('F', '0'))
        .concat(applyNextFloat(binary.replace('F', '1')));
  }
}

function applyMaskFloating(binary: string, mask: string): string {
  let array = binary.split('');
  let result = new Array(36);

  for (let i = 0; i < mask.length; i++) {
    const m = mask[mask.length - 1 - i];
    const a = array[array.length - 1 - i] || '0';

    if (m === '0') {
      result[result.length - 1 - i] = a;
    } else if (m === '1') {
      result[result.length - 1 - i] = '1';
    } else {
      result[result.length - 1 - i] = 'F';
    }
  }
  return result.join('');
}

console.log(partOne());
console.log(partTwo());
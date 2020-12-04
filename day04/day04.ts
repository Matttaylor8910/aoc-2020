import fs = require('fs');

interface Passport {
  [key: string]: string;
}

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

function partOne(passports: Passport[]) {
  return passports.filter(passport => required.every(key => passport[key]))
      .length;
}

function partTwo(passports: Passport[]) {
  return passports
      .filter(passport => required.every(key => isValid(key, passport)))
      .length;
}

function isValid(key: string, passport: any): boolean {
  if (!passport[key]) {
    return false;
  }

  switch (key) {
    case 'byr':
      return inRange(parseInt(passport[key]), 1920, 2002);
    case 'iyr':
      return inRange(parseInt(passport[key]), 2010, 2020);
    case 'eyr':
      return inRange(parseInt(passport[key]), 2020, 2030);
    case 'hgt':
      const hgt = passport[key] as string;
      const cm = hgt.split('cm');
      const inch = hgt.split('in');

      // working with inches
      if (cm[0].includes('in')) {
        return inRange(parseInt(inch[0]), 59, 76);
      }
      // working with cm
      else {
        return inRange(parseInt(cm[0]), 150, 193);
      }
    case 'hcl':
      return isHexColor(passport[key]);
    case 'ecl':
      return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(
          passport[key]);
    case 'pid':
      const pid = passport[key];
      return pid.length === 9 && !isNaN(pid);
    default:
      return false;
  }
}

function inRange(num: number, min: number, max: number): boolean {
  return min <= num && num <= max;
}

function isHexColor(hex: string) {
  const hash = hex.length && hex[0] === '#';
  hex = hex.substring(1);
  return hash && typeof hex === 'string' && hex.length === 6 &&
      !isNaN(Number('0x' + hex))
}

function parseInput(): Passport[] {
  let passports = [];
  let currentPassport = {};

  fs.readFileSync('day04/day04.txt', 'utf8').split('\n').forEach(line => {
    if (line === '') {
      passports.push(currentPassport);
      currentPassport = {};
    } else {
      for (const item of line.split(' ')) {
        const split = item.split(':');
        currentPassport[split[0]] = split[1];
      }
    }
  });

  return passports;
}

const passports = parseInput();
console.log(partOne(passports));
console.log(partTwo(passports));

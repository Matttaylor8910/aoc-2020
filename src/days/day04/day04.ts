import {readFile} from '../../common/file';

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

function isValid(key: string, passport: Passport): boolean {
  const value = passport[key];
  if (!value) {
    return false;
  }

  switch (key) {
    case 'byr':
      return inRange(value, 1920, 2002);
    case 'iyr':
      return inRange(value, 2010, 2020);
    case 'eyr':
      return inRange(value, 2020, 2030);
    case 'hgt':
      const cm = value.split('cm');
      const inch = value.split('in');

      // working with inches
      if (cm[0].includes('in')) {
        return inRange(inch[0], 59, 76);
      }
      // working with cm
      else {
        return inRange(cm[0], 150, 193);
      }
    case 'hcl':
      return value.match(/^#[0-9a-f]{6}$/) !== null;
    case 'ecl':
      return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value);
    case 'pid':
      return value.length === 9 && !isNaN(Number(value));
    default:
      return false;
  }
}

function inRange(num: string|number, min: number, max: number): boolean {
  num = Number(num);
  return min <= num && num <= max;
}

function parseInput(): Passport[] {
  let passports = [];
  let currentPassport = {};

  readFile().forEach(line => {
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

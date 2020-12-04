import fs = require('fs');

const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

function partOne(passports: any[]) {
  return passports
      .filter(passport => {
        for (const key of required) {
          if (!passport[key]) {
            return false;
          }
        }
        return true;
      })
      .length;
}

function partTwo(passports: any[]) {
  return passports
      .filter(passport => {
        for (const key of required) {
          if (!passport[key]) {
            return false;
          }

          switch (key) {
            case 'byr':
              const byr = parseInt(passport[key]);
              if (byr < 1920 || byr > 2002) {
                return false;
              }
              break;
            case 'iyr':
              const iyr = parseInt(passport[key]);
              if (iyr < 2010 || iyr > 2020) {
                return false;
              }
              break;
            case 'eyr':
              const eyr = parseInt(passport[key]);
              if (eyr < 2020 || eyr > 2030) {
                return false;
              }
              break;
            case 'hgt':
              const hgt = passport[key] as string;
              const cm = hgt.split('cm');
              const inch = hgt.split('in');

              // working with inches
              if (cm[0].includes('in')) {
                let value = parseInt(inch[0]);
                if (value < 59 || value > 76) {
                  return false;
                }
              }

              // working with cm
              else {
                let value = parseInt(cm[0]);
                if (value < 150 || value > 193) {
                  return false;
                }
              }
              break;
            case 'hcl':
              const hcl = passport[key];
              if (!isHexColor(hcl)) {
                return false;
              }
              break;
            case 'ecl':
              const ecl = passport[key];
              if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(
                      ecl)) {
                return false;
              }
              break;
            case 'pid':
              const pid = passport[key];
              if (pid.length !== 9 || isNaN(pid)) {
                return false;
              }
              break;
          }
        }
        return true;
      })
      .length;
}

function isHexColor(hex: string) {
  const hash = hex.length && hex[0] === '#';
  hex = hex.substring(1);
  return hash && typeof hex === 'string' && hex.length === 6 &&
      !isNaN(Number('0x' + hex))
}

function parseInput(): any[] {
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

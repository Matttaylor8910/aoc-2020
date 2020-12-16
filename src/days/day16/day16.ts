import {readFile} from '../../common/file';

interface Range {
  min: number;
  max: number;
}

interface Field {
  name: string;
  ranges: Range[];
}

const fields: Field[] = [];
let myTicket: number[];
let nearbyTickets: number[][] = [];

function partOne() {
  return nearbyTickets
      .map(ticket => {
        return ticket
            // map each ticket down to the sum of its invalid fields
            .filter(value => !fields.some(field => isValid(field, value)))
            .reduce((a, b) => a + b, 0);
      })
      // then calculate the total sum
      .reduce((a, b) => a + b, 0);
}

function partTwo() {
  // filter to just valid tickets + our ticket
  const valid = nearbyTickets.filter(ticket => {
    return ticket.every(value => fields.some(field => isValid(field, value)));
  });
  valid.push(myTicket);

  // get the valid fields for each of the columns then sort them ascneding by
  // the number of valid fields
  const positions: {index: number, fields: string[]}[] =
      new Array(fields.length);
  for (let i = 0; i < myTicket.length; i++) {
    positions[i] = {
      index: i,
      fields: getFieldsForIndex(i, valid).map(field => field.name)
    };
  }
  positions.sort((a, b) => a.fields.length - b.fields.length);

  // set up a set to ensure we don't use the same field twice
  let result = 1;
  const used = new Set<string>();

  // iterate through the positions to get the only available field and if it is
  // a departure field, multiple it by the result
  for (const position of positions) {
    const name = position.fields.filter(field => !used.has(field))[0];
    used.add(name);
    if (name.includes('departure')) {
      result *= myTicket[position.index];
    }
  }

  // return this final result
  return result;
}

function getFieldsForIndex(i: number, tickets: number[][]): Field[] {
  return fields.filter(field => {
    return tickets.every(ticket => {
      return isValid(field, ticket[i]);
    });
  });
}

function isValid(field: Field, value: number): boolean {
  return field.ranges.some(range => {
    return range.min <= value && value <= range.max;
  });
}

function parseInput() {
  let phase = 0;

  readFile().forEach(line => {
    // phase 0: get fields and ranges
    if (phase === 0) {
      if (line.length < 1) {
        phase = 1;
        return;
      }

      let split = line.split(': ');
      const name = split[0];
      split = split[1].split(' or ');

      // build up one field with its name and ranges
      const field: Field = {name, ranges: []};
      for (const s of split) {
        const nums = s.split('-');
        field.ranges.push({min: Number(nums[0]), max: Number(nums[1])});
      }

      fields.push(field);
    }

    // phase 1: parse my ticket
    else if (phase === 1) {
      if (line.length < 1) {
        phase = 2;
        return;
      }
      if (line.includes(',')) {
        myTicket = line.split(',').map(Number);
      }
    }

    // phase 2: parse nearby tickets
    else {
      if (line.includes(',')) {
        nearbyTickets.push(line.split(',').map(Number));
      }
    }
  });
}

parseInput();
console.log(partOne());
console.log(partTwo());
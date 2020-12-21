import {readFile} from '../../common/file';

interface Rule {
  id: string;
  options: string[][];
}

const terminalCharacters = new Set<string>();
const rules = new Map<string, Rule>();
const toTest: string[] = [];

function partOne() {
  return toTest.filter(test => match(rules.get('0'), test)).length;
}

function partTwo() {
  // override rules 8 and 11
  rules.set('8', {id: '8', options: [['42'], ['42', '8']]});
  rules.set('11', {id: '1', options: [['42', '31'], ['42', '11', '31']]});

  return toTest.filter(test => match(rules.get('0'), test)).length;
}

function match(start: Rule, message: string): boolean {
  // each "node" in the stack is a possible string in the form of an array of
  // its parts. when one of these
  const stack: string[][] = [...start.options];
  const seen = new Set<string>();

  while (stack.length) {
    // an array of the tokens in this string
    const current = stack.pop();
    const asString = current.join('');

    // if we have the message, true
    if (asString === message) return true;

    // skip this iteration if we're been here before
    if (seen.has(asString)) {
      continue;
    } else {
      seen.add(asString);
    }

    // short circuit on strings that get too long
    if (current.length > message.length) continue;

    // for the first non-terminal character, replace it with the options it
    // could be, given its rule
    // ex. "31" gets replaced with "53" "91" or "127" "77"
    for (let i = 0; i < current.length; i++) {
      const char = current[i];
      if (terminalCharacters.has(char)) {
        if (char !== message[i]) break;
      } else {
        const {options} = rules.get(char);
        // replace this char with each option
        for (const option of options) {
          const next = [...current];
          next.splice(i, 1, ...option);
          stack.push(next);
        }
        break;
      }
    }
  }

  return false;
}

function parseInput() {
  let parseRules = true;
  readFile().forEach(line => {
    if (parseRules) {
      if (line.length < 2) {
        parseRules = false;
      } else {
        const split = line.split(': ');
        const id = split[0];
        const terminal = split[1].includes('"');
        const options = split[1]
                            .replace(/["]+/g, '')
                            .split('|')
                            .map(
                                option => option.split(' ').filter(
                                    option => option.length));
        rules.set(id, {id, options});

        if (terminal) {
          terminalCharacters.add(options[0][0]);
        }
      }
    } else {
      toTest.push(line);
    }
  });
}

parseInput();

console.log(partOne());
console.log(partTwo());
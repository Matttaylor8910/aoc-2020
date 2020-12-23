interface CircularNode {
  number: number;
  next: CircularNode|null;
}

const nodes = new Map<number, CircularNode>();
let start = 0;

function partOne() {
  play(100, nodes.get(start));

  let toReturn = '';
  let current = nodes.get(1).next;
  while (current.number !== 1) {
    toReturn += current.number;
    current = current.next;
  }
  return toReturn;
}

function partTwo() {
  play(10000000, nodes.get(start));

  const one = nodes.get(1);
  return one.next.number * one.next.next.number;
}

function play(turns: number, current: CircularNode) {
  let turn = 1;

  while (turn <= turns) {
    const {number} = current;

    // pick 3
    const pickedUp = [
      current.next.number,
      current.next.next.number,
      current.next.next.next.number,
    ];
    current.next = current.next.next.next.next;

    // find destination
    let destNumber = number - 1;
    let destination = nodes.get(number - 1);
    while (!destination || pickedUp.includes(destNumber)) {
      destNumber--;
      if (destNumber <= 0) {
        destNumber = nodes.size;
      }
      destination = nodes.get(destNumber);
    }

    // reassign next
    nodes.get(pickedUp[2]).next = destination.next;
    destination.next = nodes.get(pickedUp[0]);

    // next!
    current = current.next;
    turn++;
  }
}

function newNode(number: number): CircularNode {
  return {number, next: null};
}

function buildMap(input: string, total?: number) {
  start = Number(input[0]);

  const first = newNode(start);
  nodes.set(start, first);
  let current = first;

  for (const num of input.substring(1).split('').map(Number)) {
    const node = newNode(num);
    nodes.set(num, node);
    current.next = node;
    current = node;
  }

  for (let i = input.length + 1; i <= total; i++) {
    const node = newNode(i);
    nodes.set(i, node);
    current.next = node;
    current = node;
  }

  current.next = first;
}

buildMap('418976235');
console.log(partOne());

buildMap('418976235', 1000000);
console.log(partTwo());
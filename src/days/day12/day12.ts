import {readFile} from '../../common/file';

enum Direction {
  N = 'N',
  S = 'S',
  E = 'E',
  W = 'W',
  F = 'F',
  L = 'L',
  R = 'R',
}

interface Instruction {
  direction: Direction;
  value: number;
}

interface Waypoint {
  horizontal: number;
  vertical: number;
}

function partOne(instructions: Instruction[]): number {
  let horizontal = 0;
  let vertical = 0;
  let current = Direction.E;

  for (const instruction of instructions) {
    if (instruction.direction === Direction.F) {
      instruction.direction = current;
    }

    switch (instruction.direction) {
      case Direction.N:
        vertical -= instruction.value;
        break;
      case Direction.E:
        horizontal += instruction.value;
        break;
      case Direction.S:
        vertical += instruction.value;
        break;
      case Direction.W:
        horizontal -= instruction.value;
        break;
      case Direction.L:
      case Direction.R:
        current = rotate(current, instruction);
        break;
    }
  }

  return Math.abs(horizontal) + Math.abs(vertical);
}

function rotate(current: Direction, instruction: Instruction): Direction {
  const directions = [Direction.N, Direction.E, Direction.S, Direction.W];
  const {direction, value} = instruction;
  const units = value / 90;

  // pad out the index so we can mod without worrying about bounds
  let index = directions.indexOf(current) + directions.length;

  if (direction === Direction.L) {
    return directions[(index - units) % directions.length];
  } else {
    return directions[(index + units) % directions.length];
  }
}

function partTwo(instructions: Instruction[]): number {
  let horizontal = 0;
  let vertical = 0;

  // waypoint starts at 10 units east, 1 unit north
  // waypoint acts like a multiplier
  let waypoint = {horizontal: 10, vertical: -1};

  for (const instruction of instructions) {
    const {value, direction} = instruction;

    switch (direction) {
      case Direction.N:
        waypoint.vertical -= value;
        break;
      case Direction.E:
        waypoint.horizontal += value;
        break;
      case Direction.S:
        waypoint.vertical += value;
        break;
      case Direction.W:
        waypoint.horizontal -= value;
        break;
      case Direction.L:
      case Direction.R:
        waypoint = rotateWaypoint(waypoint, instruction);
        // rotate affects waypoint
        break;
      case Direction.F:
        horizontal += waypoint.horizontal * value;
        vertical += waypoint.vertical * value;
        break;
    }
  }

  return Math.abs(horizontal) + Math.abs(vertical);
}

function rotateWaypoint(
    waypoint: Waypoint,
    instruction: Instruction,
    ): Waypoint {
  const {direction, value} = instruction;
  let units = value / 90;

  while (units > 0) {
    const h = waypoint.horizontal;

    if (direction === Direction.L) {
      waypoint.horizontal = waypoint.vertical;
      waypoint.vertical = h * -1;
    } else {
      waypoint.horizontal = waypoint.vertical * -1;
      waypoint.vertical = h;
    }

    units--;
  }

  return waypoint;
}

function parseInput(): Instruction[] {
  return readFile().map(line => {
    return {
      direction: line[0] as Direction,
      value: Number(line.substr(1)),
    };
  });
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));
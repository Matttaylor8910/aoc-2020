import {readFile} from '../../common/file';

interface Seat {
  line: string;
  seatId: number;  // (row * 8) + col
  row: number;
  col: number;
}

function partOne(seats: Seat[]) {
  let max = 0;
  for (const seat of seats) {
    if (seat.seatId > max) {
      max = seat.seatId;
    }
  }
  return max;
}

function partTwo(seats: Seat[]) {
  const sorted = seats.map(seat => seat.seatId).sort((a, b) => a - b);

  for (let i = 0; i < sorted.length - 1; i++) {
    const id = sorted[i];
    const next = sorted[i + 1];
    if (next - id > 1) {
      return id + 1;
    }
  }

  return 'error';
}

function parseInput(): Seat[] {
  return readFile().map(getSeat);
}

function getSeat(line: string) {
  // row (rows are numbered 0 to 127)
  let rowBottom = 0;
  let rowTop = 127;

  // col (seats are numbered 0 to 7)
  let colBottom = 0;
  let colTop = 7;

  for (const char of line.split('')) {
    const rowMiddle = Math.floor((rowTop + rowBottom) / 2);
    const colMiddle = Math.floor((colTop + colBottom) / 2);

    if (char === 'F') {
      rowTop = rowMiddle;
    } else if (char === 'B') {
      rowBottom = rowMiddle;
    } else if (char === 'L') {
      colTop = colMiddle;
    } else if (char === 'R') {
      colBottom = colMiddle;
    }
  }

  return {line, row: rowTop, col: colTop, seatId: (rowTop * 8) + colTop};
}

const seats = parseInput();
console.log(partOne(seats));
console.log(partTwo(seats));
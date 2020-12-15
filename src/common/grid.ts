import {cloneDeep} from 'lodash';

interface DirectionOffset {
  x: number;
  y: number;
}

const Direction: {[direction: string]: DirectionOffset} = {
  N: {x: 0, y: -1},
  NE: {x: 1, y: -1},
  E: {x: 1, y: 0},
  SE: {x: 1, y: 1},
  S: {x: 0, y: 1},
  SW: {x: -1, y: 1},
  W: {x: -1, y: 0},
  NW: {x: -1, y: -1},
}

export class Grid {
  private _rows: number;
  private _cols: number;

  private _grid: string[][];

  constructor(grid: string[][]) {
    this._rows = grid ? grid.length : 0;
    this._cols = grid && grid[0] ? grid[0].length : 0;
    this._grid = cloneDeep(grid);
  }

  get rows(): number {
    return this._rows;
  }

  get cols(): number {
    return this._cols;
  }

  clone(): Grid {
    return new Grid(this._grid);
  }

  /**
   * Given a row and col, return the string at that coordinate if it exists,
   * otherwise return null
   * @param row
   * @param col
   */
  getCell(row: number, col: number): string|null {
    return this.inBounds(row, col) ? this._grid[row][col] : null;
  }

  /**
   * Set the current coordinate to the given value
   * @param row
   * @param col
   * @param value
   */
  setCell(row: number, col: number, value: string) {
    this._grid[row][col] = value;
  }

  /**
   * Given a row and col, return a map of the cells neighboring the given
   * coordinate where the key is the string value in the cells and the value is
   * the count. For example if there are 5 in-bounds neighbors, 2 of which are
   * 'L' and 3 are '#', return {'L': 2, '#': 3}
   *
   * If a string[] is provided as a thrid parameter (skipOver), ignore those
   * strings if you see them and look beyond them as if they weren't there.
   * @param row
   * @param col
   * @param skipOver a list of strings to skip over
   */
  getNeighborMap(row: number, col: number, skipOver?: string[]):
      Map<string, number> {
    const map = new Map<string, number>();

    this.getNeighbors(row, col, skipOver).forEach(neighbor => {
      map.set(neighbor, (map.get(neighbor) || 0) + 1);
    });

    return map;
  }

  /**
   * Return nearby neighbors
   * @param row
   * @param col
   * @param skipOver
   */
  getNeighbors(row: number, col: number, skipOver?: string[]): string[] {
    return [
      this.getDirection(row, col, Direction.N, skipOver),
      this.getDirection(row, col, Direction.NE, skipOver),
      this.getDirection(row, col, Direction.E, skipOver),
      this.getDirection(row, col, Direction.SE, skipOver),
      this.getDirection(row, col, Direction.S, skipOver),
      this.getDirection(row, col, Direction.SW, skipOver),
      this.getDirection(row, col, Direction.W, skipOver),
      this.getDirection(row, col, Direction.NW, skipOver),
    ].filter(neighbor => neighbor !== null);
  }

  /**
   * Count the number of occurences of the given value in the grid
   * @param value
   */
  count(value: string): number {
    return this._grid.map(row => row.filter(cell => cell === value).length)
        .reduce((a, b) => a + b);
  }

  toString(): string {
    return this._grid.map(row => row.join('')).join('');
  }

  prettyPrint() {
    console.log('\n');
    this._grid.forEach(row => console.log(row.join('')));
    console.log('\n');
  }

  /**
   * Get the first cell in the direction, based on the given direction offset,
   * that is not skipped over. If there isn't a valid cell, return null
   * @param row
   * @param col
   * @param offset
   * @param skipOver
   */
  private getDirection(
      row: number,
      col: number,
      offset: DirectionOffset,
      skipOver?: string[],
      ): string|null {
    // find the cell, short-circuit
    const {x, y} = offset;
    const cell = this.getCell(row + y, col + x);
    if (cell === null) return null;

    // when skipOver is present, and the cell is in this skipOver set, return
    // the next thing in the given direction
    if (skipOver && skipOver.includes(cell)) {
      return this.getDirection(row + y, col + x, offset, skipOver);
    }

    // valid cell, return
    return cell;
  }

  /**
   * Return true if the given coordinate is in the bounds of the grid
   * @param row
   * @param col
   */
  private inBounds(row: number, col: number): boolean {
    return 0 <= row && row < this.rows && 0 <= col && col < this.cols;
  }
}
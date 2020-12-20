import {readFile} from '../../common/file';
import {flipMatrixX, rotateMatrix} from '../../common/matrix';
import {reverse} from '../../common/string';

const SEA_MONSTER = {
  width: 20,
  hashtags: 15,
  lines: [
    /..................#./g,
    /#....##....##....###/g,
    /.#..#..#..#..#..#.../g,
  ]
}

interface Tile {
  id: number;
  image: string[][];
  borders: {north: string; east: string; south: string; west: string;};
}

interface TileNode {
  tile: Tile;

  north: Tile;
  east: Tile;
  south: Tile;
  west: Tile;

  eastNode?: TileNode;
  southNode?: TileNode;
}

const borders = new Map<string, Tile[]>();

function partOne(tiles: Tile[]) {
  return tiles.filter(tile => getAllNeighbors(tile).length === 2)
      .map(tile => tile.id)
      .reduce((a, b) => a * b, 1);
}

function getNeighborInDir(id: number, border: string): Tile {
  return (borders.get(border) || [])
      .concat(borders.get(reverse(border)) || [])
      .filter(tile => tile.id !== id)[0];
}

function getAllNeighbors(tile: Tile): Tile[] {
  return [
    getNeighborInDir(tile.id, tile.borders.north),
    getNeighborInDir(tile.id, tile.borders.east),
    getNeighborInDir(tile.id, tile.borders.south),
    getNeighborInDir(tile.id, tile.borders.west),
  ].filter(Boolean);
}

function partTwo(tiles: Tile[]) {
  const corners = tiles.filter(tile => getAllNeighbors(tile).length === 2);

  let topLeft = corners[0];
  let rotations = 0;

  let north = getNeighborInDir(topLeft.id, topLeft.borders.north);
  let west = getNeighborInDir(topLeft.id, topLeft.borders.west);

  // rotate until north + west are blank
  while (north || west) {
    rotateTile(topLeft);

    north = getNeighborInDir(topLeft.id, topLeft.borders.north);
    west = getNeighborInDir(topLeft.id, topLeft.borders.west);

    rotations++;
  }

  let fullImage = getFullImage(topLeft);
  let i = 0;
  let counts = [];

  // first four rotations
  while (i < 4) {
    counts.push(getSeaMonstersIn(fullImage));
    fullImage = rotateMatrix(fullImage);
    i++;
  }

  // flip
  fullImage = flipMatrixX(fullImage);

  // next 4 rotaions
  while (i < 8) {
    counts.push(getSeaMonstersIn(fullImage));
    fullImage = rotateMatrix(fullImage);
    i++;
  }

  const count = counts.filter(num => num > 0)[0];
  return fullImage.map(row => row.filter(cell => cell === '#').length)
             .reduce((a, b) => a + b) -
      (SEA_MONSTER.hashtags * count);
}

function getSeaMonstersIn(image: string[][]): number {
  let count = 0;

  const rows = image.map(row => row.join(''));

  // width of sea monster
  let window = SEA_MONSTER.width;

  for (let i = 1; i < rows.length - 1; i++) {
    for (let start = 0; start < rows[i].length - window + 1; start++) {
      let matchingLines = 0;
      for (let m = 0; m < SEA_MONSTER.lines.length; m++) {
        const line = SEA_MONSTER.lines[m];
        if (rows[i - 1 + m].substr(start, window).match(line)) {
          matchingLines++;
        }
      }
      if (matchingLines === 3) {
        count++;
      }
    }
  }

  return count;
}

function getFullImage(topLeft: Tile): string[][] {
  const placed = new Set<number>();
  const startNode = newNode(topLeft);

  const stack = [startNode];
  placed.add(startNode.tile.id);

  while (stack.length) {
    const current = stack.pop();

    if (current.east && !placed.has(current.east.id)) {
      let rotations = 0;
      // tiles must have reversed borders to match
      while (reverse(current.east.borders.west) !== current.tile.borders.east) {
        if (rotations < 4) {
          rotateTile(current.east);
          rotations++;
        } else {
          flipTile(current.east);
          rotations = 0;
        }
      }
      current.eastNode = newNode(current.east);
      stack.push(current.eastNode);
      placed.add(current.east.id);
    }

    if (current.south && !placed.has(current.south.id)) {
      let rotations = 0;
      // tiles must have reversed borders to match
      while (reverse(current.south.borders.north) !==
             current.tile.borders.south) {
        if (rotations < 4) {
          rotateTile(current.south);
          rotations++;
        } else {
          flipTile(current.south);
          rotations = 0;
        }
      }
      current.southNode = newNode(current.south);
      stack.push(current.southNode);
      placed.add(current.south.id);
    }
  }

  const image: string[][] = [];
  let offset = 0;

  let currentNode = startNode;
  let startRow = startNode;

  while (startRow) {
    while (currentNode) {
      // add its part of the image to the full image
      for (let i = 1; i < currentNode.tile.image.length - 1; i++) {
        image[i + offset - 1] =
            (image[i + offset - 1] || [])
                .concat(currentNode.tile.image[i].slice(
                    1, currentNode.tile.image[i].length - 1));
      }

      currentNode = currentNode.eastNode;
    }

    offset += startRow.tile.image.length - 2;
    startRow = startRow.southNode;
    currentNode = startRow;
  }

  return image;
}

// rotate by N quarter turns clockwise
function rotateTile(tile: Tile) {
  tile.borders = {
    north: tile.borders.west,
    east: tile.borders.north,
    south: tile.borders.east,
    west: tile.borders.south,
  };

  // rotate image
  tile.image = rotateMatrix(tile.image);
}

function flipTile(tile: Tile) {
  tile.borders = {
    north: reverse(tile.borders.north),
    east: reverse(tile.borders.west),
    south: reverse(tile.borders.south),
    west: reverse(tile.borders.east),
  };

  // flip image on X axis
  tile.image = flipMatrixX(tile.image);
}

function newNode(tile: Tile): TileNode {
  const node: Partial<TileNode> = {};

  node.tile = tile;

  node.north = getNeighborInDir(tile.id, tile.borders.north);
  node.east = getNeighborInDir(tile.id, tile.borders.east);
  node.south = getNeighborInDir(tile.id, tile.borders.south);
  node.west = getNeighborInDir(tile.id, tile.borders.west);

  return node as TileNode;
}

function parseInput(): Tile[] {
  let tiles: Tile[] = [];
  let current: any = {image: []};

  readFile().forEach(line => {
    if (line.includes('Tile')) {
      current.id = Number(line.split('Tile ')[1].split(':')[0]);
    } else if (line.length < 2) {
      // calculate borders, clockwise around the outside of each image tile
      current.borders = {
        north: current.image[0].join(''),
        east: current.image.map(row => row[row.length - 1]).join(''),
        south: reverse(current.image[current.image.length - 1].join('')),
        west: reverse(current.image.map(row => row[0]).join('')),
      };

      // add these borders to the map with the value being the tiles that have
      // this border
      for (const border of (Object.values(current.borders))) {
        const key = border as string;
        borders.set(key, (borders.get(key) || []).concat(current));
      }

      // save tile
      tiles.push(current);

      // reset
      current = {image: []};
    } else {
      current.image.push(line.split(''));
    }
  });

  return tiles;
}

const tiles = parseInput();
console.log(partOne(tiles));
console.log(partTwo(tiles));
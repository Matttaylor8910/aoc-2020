export function prettyPrint(matrix: string[][]) {
  console.log(`\n\n`);
  matrix.forEach(row => {
    console.log(row.join(''));
  });
}

export function rotateMatrix(matrix: string[][]): string[][] {
  const newMatrix = [...matrix].map(row => [...row]);

  const n = newMatrix.length;
  const x = Math.floor(n / 2);
  const y = n - 1;
  for (let i = 0; i < x; i++) {
    for (let j = i; j < y - i; j++) {
      const k = newMatrix[i][j];
      newMatrix[i][j] = newMatrix[y - j][i];
      newMatrix[y - j][i] = newMatrix[y - i][y - j];
      newMatrix[y - i][y - j] = newMatrix[j][y - i]
      newMatrix[j][y - i] = k;
    }
  }

  return newMatrix;
}

export function flipMatrixX(matrix: string[][]): string[][] {
  const newMatrix = [...matrix].map(row => [...row]);
  newMatrix.forEach(row => row.reverse());
  return newMatrix;
}
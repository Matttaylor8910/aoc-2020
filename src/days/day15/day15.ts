function getLastSpoken(numbers: number[], at: number) {
  const spokenAt = new Map<number, number>();
  let lastSpoken: number;
  let firstTime: boolean;

  for (let i = 0; i < numbers.length; i++) {
    lastSpoken = numbers[i];
    firstTime = !spokenAt.has(lastSpoken);
    spokenAt.set(lastSpoken, i + 1);
  }

  for (let i = numbers.length; i < at; i++) {
    const before = spokenAt.get(lastSpoken);
    spokenAt.set(lastSpoken, i);
    if (firstTime) {
      lastSpoken = 0;
    } else {
      lastSpoken = i - before;
    }

    firstTime = !spokenAt.has(lastSpoken);
  }

  return lastSpoken;
}

const numbers = [13, 16, 0, 12, 15, 1];
console.log(getLastSpoken(numbers, 2020));
console.log(getLastSpoken(numbers, 30000000));
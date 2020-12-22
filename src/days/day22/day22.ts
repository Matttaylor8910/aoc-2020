import {readFile} from '../../common/file';

interface Player {
  cards: number[];
}

function partOne(players: Player[]) {
  const {cards: player1} = players[0];
  const {cards: player2} = players[1];

  while (player1.length && player2.length) {
    const one = player1.shift();
    const two = player2.shift();

    if (one > two) {
      player1.push(one, two);
    } else {
      player2.push(two, one);
    }
  }

  let score = 0;
  let winner = player1.length ? player1 : player2;
  for (let i = 0; i < winner.length; i++) {
    score += winner[i] * (winner.length - i);
  }
  return score;
}

function partTwo(players: Player[]) {
  const {cards: player1} = players[0];
  const {cards: player2} = players[1];

  const {cards} = playRecursive(player1, player2);
  let score = 0;
  for (let i = 0; i < cards.length; i++) {
    score += cards[i] * (cards.length - i);
  }
  return score;
}

// return true for player1, false for player2, also return cards
function playRecursive(player1: number[], player2: number[], depth = 1) {
  const seen = new Set<string>();

  while (player1.length && player2.length) {
    const key = `${player1.join(',')}-${player2.join(',')}`;
    if (seen.has(key)) {
      return {winner: true, cards: player1};
    } else {
      seen.add(key);
    }

    const one = player1.shift();
    const two = player2.shift();

    // both have enough, recurse!
    if (one <= player1.length && two <= player2.length) {
      const {winner} = playRecursive(
          player1.slice(0, one), player2.slice(0, two), depth + 1);
      if (winner) {
        player1.push(one, two);
      } else {
        player2.push(two, one);
      }
    } else {
      if (one > two) {
        player1.push(one, two);
      } else {
        player2.push(two, one);
      }
    }
  }

  const winner = player1.length ? player1 : player2;
  return {winner: player1.length > 0, cards: winner};
}

function parseInput(): Player[] {
  const players = [];
  let cards = [];

  readFile().forEach(line => {
    if (line.includes('Player')) {
      // do nothing
    } else if (!line.length) {
      players.push({cards});
      cards = [];
    } else {
      cards.push(Number(line));
    }
  });

  return players;
}

console.log(partOne(parseInput()));
console.log(partTwo(parseInput()));
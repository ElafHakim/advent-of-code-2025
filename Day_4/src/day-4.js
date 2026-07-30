import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function showGrid(grid) {
  console.log(grid.map((row) => row.join("")).join("\n"));
}

function loadGrid(path) {
  const data = readFileSync(path, "utf-8");
  const grid = data.replace(/\r/g, "").trim().split("\n").map(row => row.split(""));
  return grid;
}

function markAccessibleRolls(inputGrid) {
  const returnGrid = inputGrid.map((row) => [...row]);

  const directions = [
    [-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1], [1, 0],[1, 1],
  ];

  let accessableRollsCount = 0;

  for (let row = 0; row < inputGrid.length; row++) {
    for (let col = 0; col < inputGrid[row].length; col++) {
      if (inputGrid[row][col] !== PAPER_ROLL) continue;

      let neighbourCount = 0;

      for (const [dRow, dCol] of directions) {
        const rowPos = row + dRow;
        const colPos = col + dCol;

        if (
          rowPos >= 0 && rowPos < inputGrid.length &&
          colPos >= 0 && colPos < inputGrid[rowPos].length &&
          inputGrid[rowPos][colPos] === PAPER_ROLL
        ) {
          neighbourCount++;
        }
      }

      if (neighbourCount < 4) {
        returnGrid[row][col] = "X";
        accessableRollsCount++;
      }
    }
  }

  return [accessableRollsCount, returnGrid];
}

function removeIsolatedRolls(inputGrid) {
  const returnGrid = inputGrid.map((row) => [...row]);

  const directions = [
    [-1, -1],[-1, 0],[-1, 1],[0, -1],[0, 1],[1, -1],[1, 0],[1, 1],
  ];

  function computeNeighbours(row, col) {
    let neighbourCount = 0;

    for (const [dRow, dCol] of directions) {
      const rowPos = row + dRow;
      const colPos = col + dCol;

      if (
        rowPos >= 0 && rowPos < returnGrid.length &&
        colPos >= 0 && colPos < returnGrid[rowPos].length &&
        returnGrid[rowPos][colPos] === PAPER_ROLL
      ) {
        neighbourCount++;
      }
    }

    return neighbourCount;
  }

  const initialNeighbourCount = inputGrid.map(row => row.map(() => 0));

  const cellsToRemove  = [];

  for (let row = 0; row < returnGrid.length; row++) {
    for (let col = 0; col < returnGrid[row].length; col++) {
      if (returnGrid[row][col] !== PAPER_ROLL) continue;

      const neighbours = computeNeighbours(row, col);
      initialNeighbourCount[row][col] = neighbours;
      if (neighbours < 4) cellsToRemove.push([row, col]);
    }
  }

  let removedCount = 0;

  while (cellsToRemove.length > 0) {
    const [row, col] = cellsToRemove .shift();
    if (returnGrid[row][col] !== PAPER_ROLL) continue;

    returnGrid[row][col] = "X";
    removedCount++;

    for (const [dRow, dCol] of directions) {
      const rowPos = row + dRow;
      const colPos = col + dCol;

      if (
        rowPos < 0 || rowPos >= returnGrid.length ||
        colPos < 0 || colPos >= returnGrid[rowPos].length ||
        returnGrid[rowPos][colPos] !== PAPER_ROLL
      ) {
        continue;
      }

      const newNeighbourCount = computeNeighbours(rowPos, colPos );
      initialNeighbourCount[rowPos][colPos] = newNeighbourCount;

      if (newNeighbourCount < 4) {
        cellsToRemove .push([rowPos, colPos]);
      }
    }
  }

  return [removedCount, returnGrid];
}

const PAPER_ROLL = "@";

const filepath = path.join(__dirname, "..", "data", "input.txt");



const input = loadGrid(filepath);
const [rollsCount, rollsGrid] = markAccessibleRolls(input);
const [rollsRemovedCount, rollsRemovedGrid] = removeIsolatedRolls(input);

console.log("--------Part1--------");
//showGrid(rollsGrid);
console.log(`${rollsCount} accessible rolls`);
console.log("---------------------");
//showGrid(rollsRemovedGrid);
console.log("--------Part2--------");
console.log(`${rollsRemovedCount} romovable rolls`);


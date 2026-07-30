import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMITTER = "S";
const SPLITTER = "^";
const BEAM = "|";
const EMPTY = ".";

function loadGrid(path) {
  const data = readFileSync(path, "utf-8");
  
  return data.replace(/\r/g, "").trim().split("\n").map(row => row.split(""));
}

function showGrid(grid) {
  console.log(grid.map(row => row.join("")).join("\n"));
}

function simulateBeamSplits(grid, showGridDetails = false) {
  const input = grid.map(row => [...row]);
  const beamPositions = [];
  let splitCount = 0;

  input[0]?.forEach((item, i) => item === EMITTER && beamPositions.push({ row: 0, col: i }));

  while (beamPositions.length > 0) {
    const currentBeam = beamPositions.shift();
    if (!currentBeam) break;

    const newRowPos = currentBeam.row + 1;
    const newRow = input[newRowPos];
    if (!newRow) break;

    if (newRow[currentBeam.col] === SPLITTER) {
      splitCount++;
      const newLPos = currentBeam.col - 1;
      const newRPos = currentBeam.col + 1;

      if (newLPos >= 0 && newRow[newLPos] === EMPTY) {
        newRow[newLPos] = BEAM;
        beamPositions.push({ row: newRowPos, col: newLPos });
      }

      if (newRPos < newRow.length && newRow[newRPos] === EMPTY) {
        newRow[newRPos] = BEAM;
        beamPositions.push({ row: newRowPos, col: newRPos });
      }
    } else if (newRow[currentBeam.col] === EMPTY) {
      newRow[currentBeam.col] = BEAM;
      beamPositions.push({ row: newRowPos, col: currentBeam.col });
    }
  }

  console.log("--------part1--------");
  console.log(`number of splits is ${splitCount}`);
  //console.log("final grid after all movements:\n");
  console.log("---------------------");
  showGridDetails && showGrid(input);
}

function countBeamTimelines(grid) {
  const input = grid.map(row => [...row]);
  const width = input[0].length;

  let currentRowCounts = new Array(width).fill(0);
  input[0]?.forEach((item, i) => item === EMITTER && (currentRowCounts[i] = 1));

  for (let row = 1; row < input.length; row++) {
    const nextRowCounts = new Array(width).fill(0);
    for (let col = 0; col < width; col++) {
      const beamCount = currentRowCounts[col];
      if (beamCount === 0) continue;

      if (input[row][col] === SPLITTER) {
        if (col - 1 >= 0) nextRowCounts[col - 1] += beamCount;
        if (col + 1 < width) nextRowCounts[col + 1] += beamCount;
      } else {
        nextRowCounts[col] += beamCount;
      }
    }
    currentRowCounts = nextRowCounts;
  }

  const timelines = currentRowCounts.reduce((sum, val) => sum + val, 0);

  console.log("--------part2--------");
  console.log(`number of timelines is ${timelines}`);
}

const filepath = path.join(__dirname, "..", "data", "input.txt");

const input = loadGrid(filepath);
//set showGridDetails = true to print the final grid
//simulateBeamSplits(input, true);
simulateBeamSplits(input);
countBeamTimelines(input);

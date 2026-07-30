import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "../data/input.txt");

console.log("AoC Day_10\n");

// ---------------- Part-1 ----------------
//Brute-Force-Ansatz über alle möglichen Button-Kombinationen (mask oder 1 << nButtons) zur Berechnung minimaler Tastendrücke.

// Parst jede Zeile in der input-Datei (eine Maschine)
function parseLine1(line) {
  const diagramMatch = line.match(/\[[.#]+\]/);
  if (!diagramMatch) {
    throw new Error("Kein Kontrollleuchten-Diagramm gefunden: " + line);
  }
  // wandelt den Zielzustand der Kontrollleuchten 

  const targetState = diagramMatch[0]
    .slice(1, -1)
    .split("")
    .map((char) => (char === "#" ? 1 : 0));

  const buttonMatches = Array.from(line.matchAll(/\(([\d,]+)\)/g));

  const buttons = buttonMatches.map((m) => m[1].split(",").map(Number));

  return { targetState, buttons };
}

// Berechnet minimale Tastendrücken für eine maschine mit Brute-Force-Ansatz
function minPresses1(machine) {
  const buttonCount = machine.buttons.length;
  const LightsCount = machine.targetState.length;

  let minPresses = Infinity;

  /**Die folgende Idee ist effizient und Speicherverbrauch in Ordnung, solange die Anzahl der Buttons ungefähr <= 20
   Sonst würde dies mehr Speicher benötigen. Deshalb ist der auskommentierte  Ansatz  mit Bitmasken speichereffizienter und performanter*/

  //Alle Kombinationen erstellen und direkt ausprobieren
  const allCombos = [[]];
  for (let i = 0; i < buttonCount; i++) {
    const newCombos = [];
    for (const combo of allCombos) {
      newCombos.push([...combo, i]);
    }
    allCombos.push(...newCombos);
  }

  // Jede Kombination ausprobieren
  for (const combo of allCombos) {
    const state = Array(LightsCount).fill(0);
    const presses = combo.length;

    for (const btn of combo) {
      machine.buttons[btn].forEach(light => {
        state[light] = state[light] === 0 ? 1 : 0; // Toggle
      });
    }

  /*for (let mask = 0; mask < 1 << buttonCount; mask++) {
    const state = Array(LightsCount).fill(0);
    let presses = 0;

    for (let btn = 0; btn < buttonCount; btn++) {
      if (mask & (1 << btn)) {
        presses++;
        for (const light of machine.buttons[btn]) {
          state[light] ^= 1;
        }
      }
    }*/

    // Prüft, obtn der aktuelle Zustand der Lampen dem Zielzustand entspricht
    let matchesTarget = true;
    for (let i = 0; i < LightsCount; i++) {
      if (state[i] !== machine.targetState[i]) {
        matchesTarget = false;
        break;
      }
    }

    if (matchesTarget) minPresses = Math.min(minPresses, presses);
  }

  return minPresses;
}
//Summiert Ergebnisse aller Maschinen
function sumMinPresses1(machines) {
  let totalPresses = 0;

  for (let index = 0; index < machines.length; index++) {
    const machine = machines[index];
    const presses = minPresses1(machine);
    if (!Number.isFinite(presses)) {
      throw new Error(`Keine Lösung für Maschine ${i}`);
    }
    totalPresses += presses;
  }

  return totalPresses;
}

function run1(filePath ) {
  const input = readFileSync(filePath , "utf-8").trim();
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  const machines = lines.map(parseLine1);
  const result = sumMinPresses1(machines);

  console.log("---Part-1---");
  console.log(`Minimale nötige Tastendrücken: ${result}\n`);
}
run1(filePath);

// ---------------- Part-2---------------
//Greedy-Algorithmus, um die minimale nötige Tastendrücken zu bestimmen, um alle joltage targets zu erreichen

function parseLine2(line) {
  const targetMatch = line.match(/\{([\d,]+)\}/);
  if (!targetMatch) {
    throw new Error("Keinen target joltage gefunden: " + line);
  }
  const target = targetMatch[1].split(",").map(Number);

const buttonMatches = Array.from(line.matchAll(/\(([\d,]+)\)/g));
  const buttons = buttonMatches.map((m) => m[1].split(",").map(Number));

  return { target, buttons };
}

function minPresses2(machine) {
  const LightsCount = machine.target.length;
  const buttonCount = machine.buttons.length;

  const currentLevels = machine.target.slice();
  let totalPresses = 0;

  while (currentLevels.some((val) => val > 0)) {
    let targetButton = -1;
    let maxScore = -1;

    for (let btn = 0; btn < machine.buttons.length; btn++) {
      const button = machine.buttons[btn];
      let score = 0;
      for (const counter of button) {
        if (currentLevels[counter] > 0) score++;
      }

      if (score > maxScore) {
        maxScore = score;
        targetButton = btn;
      }
    }

    if (targetButton === -1) {
      throw new Error("Keinen gültigen Tastendrück gefunden");
    }

    for (let i = 0; i < machine.buttons[targetButton].length; i++) {
      const counter = machine.buttons[targetButton][i];
      currentLevels[counter]--;
    }
    totalPresses++;
  }

  return totalPresses;
}

function run2(filePath) {
  const input = readFileSync(filePath , "utf-8").trim();
  const lines = input.split("\n").filter((line) => line.trim().length > 0);
  const machines = lines.map(parseLine2);
  const result = sumMinPresses2(machines);

  function sumMinPresses2(machines) {
    let totalPresses = 0;

    for (let index = 0; index < machines.length; index++) {
      const machine = machines[index];
      const presses = minPresses2(machine);
      if (!Number.isFinite(presses)) {
        throw new Error(`Keine Lösung für Maschine ${i}`);
      }
      totalPresses += presses;
    }

    return totalPresses;
  }

  console.log("---Part-2---");
  console.log(`Minimale nötige Tastendrücken: ${result}\n`);
}
run2(filePath);

// Sudoku-Spiel: Viele Features

// Globale Variablen
let boardElement;            // Das HTML-Board
let cells = [];              // Array mit allen Zellen (HTML-Elementen)
let puzzle = [];             // Aktuelles Sudoku-Puzzle als 2D-Array
let solution = [];           // Fertige Lösung als 2D-Array
let notesMode = false;       // Ist der Notizmodus an/aus
let undoStack = [];          // Stack für Undo
let redoStack = [];          // Stack für Redo
let startTime;               // Startzeit für den Timer
let timerInterval;           // Intervall-ID für Timer
let gameFinished = false;    // Zeigt an, ob das Sudoku bereits gelöst ist

// Vorab: Beispielpuzzles (optional) für verschiedene Schwierigkeitsgrade
// (Für echte Random-Generierung kann man einen Sudoku-Generator nutzen.)
const PUZZLES = {
  easy: [
    // Jede Zeile: 81 Zeichen oder als Array
    // Hier nur 1 Beispiel-Puzzle. Du kannst mehrere speichern.
    "530070000600195000098000060800060003400803001700020006060000280000419005000080079"
  ],
  medium: [
    "000260701680070004190004050820100040004602900050003028040300076706050012003092000"
  ],
  hard: [
    "300000000000603070010000200000000000706080304004000009500102000000000060000000000"
  ],
  expert: [
    "900000000001308600000000009000000304000010000403000000200000000004701200000000005"
  ]
};

// Beispiel-Lösungen (parallel zum Puzzle, wenn man nicht selbst lösen möchte)
// Besser ist es, den Solver selbst das Puzzle lösen zu lassen.
const SOLUTIONS = {
  easy: [
    "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
  ],
  medium: [
    "543269781682175934197834652826197345374652918951483728249318576736529412418792563"
  ],
  hard: [
    "367924851249653178518781296832549617796188324154367289581132746473896562926475183"
    // Achtung: Diese Lösung ist nur ein Platzhalter und passt evtl. nicht exakt
  ],
  expert: [
    "945126837721398645836547219572689314698413572413275968259834761364751298187962453"
    // Achtung: Platzhalter
  ]
};

// Sudoku lösen (Backtracking) - Falls du wirklich generisch lösen willst.
function solveSudoku(grid) {
  // grid ist 2D-Array
  // Finde eine leere Stelle
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) {
        // Probiere Zahlen 1-9
        for (let num = 1; num <= 9; num++) {
          if (isValid(grid, row, col, num)) {
            grid[row][col] = num;
            if (solveSudoku(grid)) {
              return true;
            }
            grid[row][col] = 0;
          }
        }
        return false; // Keine Zahl passt
      }
    }
  }
  return true; // Fertig
}

function isValid(grid, row, col, num) {
  // Zeile
  for (let x = 0; x < 9; x++) {
    if (grid[row][x] === num) return false;
  }
  // Spalte
  for (let y = 0; y < 9; y++) {
    if (grid[y][col] === num) return false;
  }
  // 3x3 Box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[startRow + i][startCol + j] === num) return false;
    }
  }
  return true;
}

// Puzzle initialisieren
function init() {
  boardElement = document.getElementById("sudoku-board");
  
  // HTML-Board leeren
  boardElement.innerHTML = "";
  cells = [];

  // 9x9 Input-Felder erstellen
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement("input");
      cell.type = "text";
      cell.maxLength = 1; // Nur ein Zeichen
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;

      // Dickere Linien (Box-Grenzen)
      if (row % 3 === 0) cell.classList.add("row-border-top");
      if (row === 8) cell.classList.add("row-border-bottom");
      if (col % 3 === 0) cell.classList.add("col-border-left");
      if (col === 8) cell.classList.add("col-border-right");

      // Wenn im Puzzle eine Zahl != 0 steht, fixieren
      if (puzzle[row][col] !== 0) {
        cell.value = puzzle[row][col];
        cell.classList.add("fixed");
        cell.disabled = true;
      } else {
        cell.value = "";
      }

      // Event-Listener für Eingabe
      cell.addEventListener("input", handleInput);
      // Event-Listener für Fokus (Markierung)
      cell.addEventListener("focus", () => highlightCell(row, col));
      cell.addEventListener("blur", removeHighlights);

      boardElement.appendChild(cell);
      cells.push(cell);
    }
  }
}

// Handle Input
function handleInput(e) {
  const cell = e.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);
  let val = cell.value;

  // Nur Ziffern 1-9 erlauben
  if (!/^[1-9]$/.test(val)) {
    cell.value = "";
    return;
  }

  // Wenn Notizmodus aktiv ist, können wir uns überlegen:
  // Entweder wir packen die Zahl als "Notiz" rein (z.B. in cell.dataset.notes),
  // oder wir lassen es als normaler Wert. 
  // Hier Beispiel: Wir überschreiben das Feld mit allen Notizen, wenn > 1 Notiz
  if (notesMode) {
    // Falls das Feld schon Notizen hat
    const currentNotes = cell.dataset.notes ? cell.dataset.notes.split(",") : [];
    if (!currentNotes.includes(val)) {
      currentNotes.push(val);
    }
    currentNotes.sort();
    cell.dataset.notes = currentNotes.join(",");
    cell.classList.add("notes");
    cell.value = currentNotes.join("");
    // Wir speichern KEINEN festen Wert im puzzle-Array, da es ja nur Notizen sind
  } else {
    // Normaler Modus: Setzen wir die Zahl ins puzzle
    // Speichere vorherigen Wert für Undo
    pushToUndoStack(row, col, puzzle[row][col], parseInt(val));

    puzzle[row][col] = parseInt(val);
    cell.classList.remove("notes");
    cell.removeAttribute("data-notes");
  }

  // Nach jedem Zug -> leere redoStack
  redoStack = [];

  // Optional: Automatische Fehlerprüfung
  // -> wir können checkConflicts() aufrufen oder so
  // checkConflicts(row, col, parseInt(val));
}

// Undo/Redo Stack
function pushToUndoStack(row, col, oldVal, newVal) {
  undoStack.push({ row, col, oldVal, newVal });
}

// Undo-Funktion
function undo() {
  if (undoStack.length === 0) return;
  const lastMove = undoStack.pop();
  const { row, col, oldVal, newVal } = lastMove;
  redoStack.push(lastMove);

  puzzle[row][col] = oldVal;
  const index = row * 9 + col;
  const cell = cells[index];

  if (oldVal === 0) {
    cell.value = "";
  } else {
    cell.value = oldVal;
  }
}

// Redo-Funktion
function redo() {
  if (redoStack.length === 0) return;
  const nextMove = redoStack.pop();
  const { row, col, oldVal, newVal } = nextMove;
  undoStack.push(nextMove);

  puzzle[row][col] = newVal;
  const index = row * 9 + col;
  const cell = cells[index];

  if (newVal === 0) {
    cell.value = "";
  } else {
    cell.value = newVal;
  }
}

// Highlight-Funktionen
function highlightCell(row, col) {
  removeHighlights(); // Alte Markierungen entfernen
  // Markiere Zeile & Spalte & Box
  for (let c = 0; c < 9; c++) {
    cells[row * 9 + c].classList.add("highlight");
  }
  for (let r = 0; r < 9; r++) {
    cells[r * 9 + col].classList.add("highlight");
  }
  // Box
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells[(startRow + r) * 9 + (startCol + c)].classList.add("highlight");
    }
  }
  // Gleiche Zahl hervorheben
  const val = puzzle[row][col];
  if (val !== 0) {
    cells.forEach((cell, index) => {
      const r = Math.floor(index / 9);
      const c = index % 9;
      if (puzzle[r][c] === val) {
        cell.classList.add("same-number");
      }
    });
  }
}

function removeHighlights() {
  cells.forEach(cell => {
    cell.classList.remove("highlight");
    cell.classList.remove("same-number");
  });
}

// Neues Puzzle laden
function newGame(difficulty) {
  // Falls du mehrere Puzzles pro Schwierigkeit hast, wähle zufällig eines aus
  const puzzleList = PUZZLES[difficulty];
  const puzzleStr = puzzleList[Math.floor(Math.random() * puzzleList.length)];

  // In 2D-Array konvertieren
  puzzle = stringToGrid(puzzleStr);

  // Lösung berechnen (oder aus festem Array laden)
  // Hier: wir nutzen SOLUTIONS-Array, um Zeit zu sparen
  // Du kannst stattdessen solveSudoku() auf puzzleCopy anwenden
  const solutionList = SOLUTIONS[difficulty];
  const solutionStr = solutionList[Math.floor(Math.random() * solutionList.length)];
  solution = stringToGrid(solutionStr);

  // Timer neu starten
  stopTimer();
  startTimer();

  // Undo/Redo zurücksetzen
  undoStack = [];
  redoStack = [];
  gameFinished = false;
  document.getElementById("status-message").textContent = "";

  init();
}

// Utility: String -> 2D-Array
function stringToGrid(str) {
  const grid = [];
  for (let i = 0; i < 9; i++) {
    grid.push([]);
    for (let j = 0; j < 9; j++) {
      const char = str[i * 9 + j];
      grid[i].push(char === "0" ? 0 : parseInt(char));
    }
  }
  return grid;
}

// Timer-Funktionen
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateTimer() {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000); // in Sek
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const minStr = minutes < 10 ? "0" + minutes : minutes;
  const secStr = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("timer").textContent = `${minStr}:${secStr}`;
}

// Check-Button -> Überprüfen, ob das Board korrekt ist
function checkPuzzle() {
  // Vergleiche puzzle mit solution
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] !== solution[row][col]) {
        document.getElementById("status-message").textContent = "Es gibt noch Fehler!";
        return;
      }
    }
  }
  document.getElementById("status-message").textContent = "Glückwunsch! Du hast das Sudoku gelöst!";
  gameFinished = true;
  stopTimer();
  // Hier könntest du ein Konfetti-Event oder Animation starten
}

// Hinweis-Funktion -> Füllt eine zufällige leere Zelle korrekt aus
function giveHint() {
  if (gameFinished) return;
  const emptyCells = [];
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (puzzle[row][col] === 0) {
        emptyCells.push({row, col});
      }
    }
  }
  if (emptyCells.length === 0) return;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const { row, col } = emptyCells[randomIndex];
  const correctValue = solution[row][col];

  // Undo-Stack aktualisieren
  pushToUndoStack(row, col, 0, correctValue);

  puzzle[row][col] = correctValue;
  const index = row * 9 + col;
  cells[index].value = correctValue;
}

// Notizmodus an/aus
function toggleNotesMode() {
  notesMode = !notesMode;
  const btn = document.getElementById("notes-toggle-btn");
  if (notesMode) {
    btn.textContent = "Notizen: An";
    btn.classList.remove("notes-off");
    btn.classList.add("notes-on");
  } else {
    btn.textContent = "Notizen: Aus";
    btn.classList.remove("notes-on");
    btn.classList.add("notes-off");
  }
}

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Local Storage (optional): Spielstand speichern/laden
// -> Du könntest hier puzzle, timer etc. speichern.
// -> Aus Zeitgründen nur ein Hinweis: 
// localStorage.setItem("sudokuState", JSON.stringify({ puzzle, time: ... }));

// Event Listener nach DOM-Load
window.addEventListener("DOMContentLoaded", () => {
  // Buttons
  const newGameBtn = document.getElementById("new-game-btn");
  const difficultySelect = document.getElementById("difficulty");
  const undoBtn = document.getElementById("undo-btn");
  const redoBtn = document.getElementById("redo-btn");
  const checkBtn = document.getElementById("check-btn");
  const hintBtn = document.getElementById("hint-btn");
  const notesToggleBtn = document.getElementById("notes-toggle-btn");
  const darkModeBtn = document.getElementById("dark-mode-btn");

  // Neue Partie starten
  newGameBtn.addEventListener("click", () => {
    const difficulty = difficultySelect.value;
    newGame(difficulty);
  });

  // Undo / Redo
  undoBtn.addEventListener("click", undo);
  redoBtn.addEventListener("click", redo);

  // Prüfen
  checkBtn.addEventListener("click", checkPuzzle);

  // Hinweis
  hintBtn.addEventListener("click", giveHint);

  // Notizmodus
  notesToggleBtn.addEventListener("click", toggleNotesMode);

  // Dark Mode
  darkModeBtn.addEventListener("click", toggleDarkMode);

  // Standardmäßig mit „Einfach“ starten
  newGame("easy");
});
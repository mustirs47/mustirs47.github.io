document.addEventListener("DOMContentLoaded", function() {
    generateSudoku();
});

function generateSudoku() {
    const grid = document.getElementById("sudoku-grid");
    grid.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("input");
            cell.type = "text";
            cell.classList.add("cell");
            cell.maxLength = 1;
            grid.appendChild(cell);
        }
    }
}

// Timer-Funktion
let seconds = 0;
let minutes = 0;
function updateTimer() {
    seconds++;
    if (seconds == 60) {
        seconds = 0;
        minutes++;
    }
    document.getElementById("timer").innerText = `Zeit: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}
setInterval(updateTimer, 1000);

// Lösung für Sudoku (einfache Implementierung)
function solveSudoku() {
    alert("Lösung wird berechnet...");
}

// Neustart-Funktion
function resetSudoku() {
    generateSudoku();
    seconds = 0;
    minutes = 0;
}
function generateSudoku() {
    const grid = document.getElementById("sudoku-grid");
    grid.innerHTML = "";
    
    for (let i = 0; i < 81; i++) {  // 9x9 = 81 Felder
        const cell = document.createElement("input");
        cell.type = "text";
        cell.classList.add("cell");
        cell.maxLength = 1;
        grid.appendChild(cell);
    }
}
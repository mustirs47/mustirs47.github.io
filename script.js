const grid = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [0, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

document.addEventListener("DOMContentLoaded", () => {
    const sudokuGrid = document.getElementById("sudoku-grid");
    
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.createElement("input");
            input.classList.add("cell");
            input.type = "number";
            input.min = "1";
            input.max = "9";
            input.pattern = "[1-9]*"; // Nur Zahlen 1-9 erlauben
            
            if (grid[row][col] !== 0) {
                input.value = grid[row][col];
                input.disabled = true;
            } else {
                input.addEventListener("input", (e) => {
                    let value = parseInt(e.target.value);
                    if (isNaN(value) || value < 1 || value > 9) {
                        e.target.value = ""; // Ungültige Eingaben löschen
                    } else {
                        e.target.value = value; // Sicherstellen, dass nur eine Zahl bleibt
                    }
                });
            }
            
            sudokuGrid.appendChild(input);
        }
    }
});

// Optional: Einfache Validierungsfunktion
function isValid(grid, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num || grid[x][col] === num) return false;
    }
    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i + startRow][j + startCol] === num) return false;
        }
    }
    return true;
}
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
    
    // Erstelle das Gitter
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const input = document.createElement("input");
            input.classList.add("cell");
            input.type = "number";
            input.min = "1";
            input.max = "9";
            
            if (grid[row][col] !== 0) {
                input.value = grid[row][col];
                input.disabled = true;
            } else {
                input.addEventListener("change", (e) => {
                    const value = parseInt(e.target.value);
                    if (value < 1 || value > 9) {
                        e.target.value = "";
                    }
                    // Optional: Sudoku-Logik hier prüfen
                });
            }
            
            sudokuGrid.appendChild(input);
        }
    }
});
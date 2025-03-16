document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("sudoku-board");
    const solveBtn = document.getElementById("solve-btn");
    const resetBtn = document.getElementById("reset-btn");

    let sudokuGrid = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ];

    function createBoard() {
        board.innerHTML = "";
        sudokuGrid.forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                const cell = document.createElement("input");
                cell.type = "text";
                cell.classList.add("cell");
                if (num !== 0) {
                    cell.value = num;
                    cell.classList.add("fixed");
                    cell.setAttribute("disabled", true);
                }
                cell.dataset.row = rowIndex;
                cell.dataset.col = colIndex;

                cell.addEventListener("input", (e) => {
                    let value = e.target.value;
                    if (!/^[1-9]$/.test(value)) {
                        e.target.value = "";
                    }
                });

                board.appendChild(cell);
            });
        });
    }

    function solveSudoku(grid) {
        function isValid(grid, row, col, num) {
            for (let x = 0; x < 9; x++) {
                if (grid[row][x] === num || grid[x][col] === num) return false;
            }
            let startRow = Math.floor(row / 3) * 3;
            let startCol = Math.floor(col / 3) * 3;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[startRow + i][startCol + j] === num) return false;
                }
            }
            return true;
        }

        function solve(grid) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (grid[row][col] === 0) {
                        for (let num = 1; num <= 9; num++) {
                            if (isValid(grid, row, col, num)) {
                                grid[row][col] = num;
                                if (solve(grid)) return true;
                                grid[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        solve(grid);
        return grid;
    }

    solveBtn.addEventListener("click", () => {
        let gridCopy = sudokuGrid.map(row => [...row]);
        let solvedGrid = solveSudoku(gridCopy);

        document.querySelectorAll(".cell").forEach(cell => {
            let row = cell.dataset.row;
            let col = cell.dataset.col;
            if (!cell.classList.contains("fixed")) {
                cell.value = solvedGrid[row][col];
            }
        });
    });

    resetBtn.addEventListener("click", createBoard);

    createBoard();
});
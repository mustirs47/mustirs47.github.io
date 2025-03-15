import React, { useState } from 'react';
import './App.css';

const initialBoard = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

function App() {
  const [board, setBoard] = useState(initialBoard);

  const handleChange = (row, col, value) => {
    const newBoard = board.map(row => [...row]);
    newBoard[row][col] = value ? parseInt(value) : 0;
    setBoard(newBoard);
  };

  const solveSudoku = () => {
    const solvedBoard = board.map(row => [...row]);
    if (solve(solvedBoard)) {
      setBoard(solvedBoard);
    } else {
      alert("No solution exists!");
    }
  };

  const solve = (board) => {
    const findEmpty = (board) => {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (board[i][j] === 0) return [i, j];
        }
      }
      return null;
    };

    const isValid = (board, num, pos) => {
      for (let x = 0; x < 9; x++) {
        if (board[pos[0]][x] === num || board[x][pos[1]] === num) return false;
      }
      const startRow = Math.floor(pos[0] / 3) * 3;
      const startCol = Math.floor(pos[1] / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (board[i + startRow][j + startCol] === num) return false;
        }
      }
      return true;
    };

    const empty = findEmpty(board);
    if (!empty) return true;

    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
      if (isValid(board, num, [row, col])) {
        board[row][col] = num;
        if (solve(board)) return true;
        board[row][col] = 0;
      }
    }
    return false;
  };

  return (
    <div className="App">
      <h1>Sudoku</h1>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="number"
                min="1"
                max="9"
                value={cell === 0 ? '' : cell}
                onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                className={`cell ${initialBoard[rowIndex][colIndex] !== 0 ? 'fixed' : ''}`}
                disabled={initialBoard[rowIndex][colIndex] !== 0}
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={solveSudoku}>Solve</button>
    </div>
  );
}

export default App;
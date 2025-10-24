// NQueen.index.js - 

const runNQueenSteps = (nSize, algCode) => {
  const steps = [];
  let solutionCount = 0;

  // Helper to add a step
  const recordStep = (board, message, action, highlight = null) => {
    steps.push({
      board: board.map(q => ({ ...q })), // Deep copy
      message,
      action,
      highlight: highlight ? { ...highlight } : null,
      result: solutionCount,
    });
  };

  // Check if placing a queen at (row, col) is safe
  const isSafe = (board, row, col) => {
    // Check column
    for (let queen of board) {
      if (queen.col === col) {
        recordStep(
          board,
          `Conflict: Column ${col} occupied by queen at row ${queen.row}`,
          'CONFLICT',
          { row, col, conflictWith: { row: queen.row, col: queen.col } }
        );
        return false;
      }
    }

    // Check diagonals
    for (let queen of board) {
      const rowDiff = Math.abs(row - queen.row);
      const colDiff = Math.abs(col - queen.col);
      
      if (rowDiff === colDiff) {
        recordStep(
          board,
          `Conflict: Diagonal attack with queen at (${queen.row}, ${queen.col})`,
          'CONFLICT',
          { row, col, conflictWith: { row: queen.row, col: queen.col } }
        );
        return false;
      }
    }

    recordStep(
      board,
      `Position (${row}, ${col}) is safe to place queen`,
      'SAFE',
      { row, col }
    );
    return true;
  };

  // Backtracking solver
  const solveNQueens = (board, row) => {
    // Base case: all queens placed
    if (row === nSize) {
      solutionCount++;
      recordStep(
        board,
        `Solution #${solutionCount} found! All ${nSize} queens placed successfully.`,
        'SOLUTION_FOUND'
      );
      return;
    }

    // Try placing queen in each column of current row
    for (let col = 0; col < nSize; col++) {
      recordStep(
        board,
        `Trying to place queen at position (${row}, ${col})`,
        'TRYING',
        { row, col }
      );

      if (isSafe(board, row, col)) {
        // Place queen
        const newBoard = [...board, { row, col }];
        recordStep(
          newBoard,
          `Queen placed at (${row}, ${col}). Moving to next row ${row + 1}.`,
          'PLACING',
          { row, col }
        );

        // Recurse to next row
        solveNQueens(newBoard, row + 1);

        // Backtrack
        recordStep(
          board,
          `Backtracking from row ${row + 1}. Removing queen at (${row}, ${col}).`,
          'BACKTRACKING',
          { row, col }
        );
      }
    }
  };

  // Start solving
  recordStep([], `Starting N-Queens solver for N=${nSize}`, 'START');
  solveNQueens([], 0);
  recordStep(
    [],
    `Algorithm completed. Total solutions found: ${solutionCount}`,
    'COMPLETED'
  );

  return { steps, solutionCount };
};

// Export helper function to check if position is under attack
export const isUnderAttack = (board, row, col) => {
  for (let queen of board) {
    if (queen.col === col) return true;
    if (Math.abs(row - queen.row) === Math.abs(col - queen.col)) return true;
  }
  return false;
};

// Export function to get all solutions (without steps)
export const getAllNQueenSolutions = (nSize) => {
  const solutions = [];

  const isSafe = (board, row, col) => {
    for (let queen of board) {
      if (queen.col === col) return false;
      if (Math.abs(row - queen.row) === Math.abs(col - queen.col)) return false;
    }
    return true;
  };

  const solve = (board, row) => {
    if (row === nSize) {
      solutions.push([...board]);
      return;
    }

    for (let col = 0; col < nSize; col++) {
      if (isSafe(board, row, col)) {
        solve([...board, { row, col }], row + 1);
      }
    }
  };

  solve([], 0);
  return solutions;
};

export default runNQueenSteps;

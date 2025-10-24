// backend/dynamicProgramming/GridPaths/GridPaths.index.js

const runGridPaths2Steps = (gridMatrix, algCode) => {
  const steps = [];
  
  if (!gridMatrix || gridMatrix.length === 0 || gridMatrix[0].length === 0) {
    return { steps: [], totalPaths: 0 };
  }

  const rows = gridMatrix.length;
  const cols = gridMatrix[0].length;

  // Check if start or end is blocked
  if (gridMatrix[0][0] === -1 || gridMatrix[rows-1][cols-1] === -1) {
    steps.push({
      dp: Array(rows).fill(null).map(() => Array(cols).fill(0)),
      message: "Impossible! Start or end position is blocked by an obstacle.",
      action: "OBSTACLE",
      currentCell: null,
      totalPaths: 0
    });
    return { steps, totalPaths: 0 };
  }

  // Initialize DP table
  const dp = Array(rows).fill(null).map(() => Array(cols).fill(0));

  // Helper to record a step
  const recordStep = (message, action, currentCell = null, fromTop = null, fromLeft = null) => {
    steps.push({
      dp: dp.map(row => [...row]), // Deep copy
      message,
      action,
      currentCell: currentCell ? { ...currentCell } : null,
      totalPaths: dp[rows-1][cols-1],
      fromTop,
      fromLeft
    });
  };

  // Start
  recordStep(
    `Starting Grid Unique Paths II algorithm on a ${rows}x${cols} grid`,
    'START'
  );

  // Initialize first cell
  dp[0][0] = 1;
  recordStep(
    `Base case: Starting position (0,0) has 1 way to reach itself`,
    'BASE_CASE',
    { row: 0, col: 0 }
  );

  // Fill the DP table
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) continue;

      recordStep(
        `Processing cell (${i},${j})...`,
        'COMPUTING',
        { row: i, col: j }
      );
      
      //obstacle
      if (gridMatrix[i][j] === -1) {
        dp[i][j] = 0;
        recordStep(
          `Cell (${i},${j}) is an obstacle. Setting paths = 0`,
          'OBSTACLE',
          { row: i, col: j }
        );
        continue;
      }

      // Get paths from top
      const fromTop = i > 0 ? dp[i-1][j] : 0;
      // Get paths from left
      const fromLeft = j > 0 ? dp[i][j-1] : 0;

      // Sum the paths
      dp[i][j] = fromTop + fromLeft;

      let detailMessage = `Computing paths to (${i},${j}):\n`;
      if (i > 0) {
        detailMessage += `  From top (${i-1},${j}): ${fromTop} paths\n`;
      } else {
        detailMessage += `  From top: 0 (out of bounds)\n`;
      }
      if (j > 0) {
        detailMessage += `  From left (${i},${j-1}): ${fromLeft} paths\n`;
      } else {
        detailMessage += `  From left: 0 (out of bounds)\n`;
      }
      detailMessage += `  Total: ${dp[i][j]} paths`;

      recordStep(
        detailMessage,
        'SUMMING',
        { row: i, col: j },
        i > 0 ? fromTop : null,
        j > 0 ? fromLeft : null
      );
    }
  }

  const totalPaths = dp[rows-1][cols-1];

  // Final result
  if (totalPaths === 0) {
    recordStep(
      `Algorithm completed. No valid paths found from (0,0) to (${rows-1},${cols-1}). All paths are blocked by obstacles.`,
      'COMPLETED'
    );
  } else {
    recordStep(
      `Algorithm completed! Total unique paths from (0,0) to (${rows-1},${cols-1}): ${totalPaths}`,
      'COMPLETED'
    );
  }

  return { steps, totalPaths };
};

// Export helper function to get only the result without visualization steps
export const getGridPathsCount = (gridMatrix) => {
  if (!gridMatrix || gridMatrix.length === 0 || gridMatrix[0].length === 0) {
    return 0;
  }

  const rows = gridMatrix.length;
  const cols = gridMatrix[0].length;

  // Check if start or end is blocked
  if (gridMatrix[0][0] === -1 || gridMatrix[rows-1][cols-1] === -1) {
    return 0;
  }

  const dp = Array(rows).fill(null).map(() => Array(cols).fill(0));
  dp[0][0] = 1;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) continue;
      if (gridMatrix[i][j] === -1) {
        dp[i][j] = 0;
        continue;
      }
      
      const fromTop = i > 0 ? dp[i-1][j] : 0;
      const fromLeft = j > 0 ? dp[i][j-1] : 0;
      dp[i][j] = fromTop + fromLeft;
    }
  }

  return dp[rows-1][cols-1];
};

export default runGridPaths2Steps;
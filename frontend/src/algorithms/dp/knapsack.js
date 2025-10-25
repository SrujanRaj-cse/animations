export const knapsack = async (
  weights,
  values,
  capacity,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  const steps = [];

  // Initialize first row and column
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 0;
  }
  for (let w = 0; w <= capacity; w++) {
    dp[0][w] = 0;
  }

  // Fill the DP table
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (isPaused && isPaused()) return;

      // Highlight current cell being computed
      setActive([[i, w]]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (weights[i - 1] <= w) {
        const takeValue = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const notTakeValue = dp[i - 1][w];
        
        dp[i][w] = Math.max(takeValue, notTakeValue);
        
        // Highlight the comparison
        setActive([[i, w], [i - 1, w - weights[i - 1]], [i - 1, w]]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      } else {
        dp[i][w] = dp[i - 1][w];
        
        // Highlight the cell we're copying from
        setActive([[i, w], [i - 1, w]]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
  }

  // Update data with DP table
  const dpData = {
    table: dp,
    weights: weights,
    values: values,
    capacity: capacity,
    result: dp[n][capacity]
  };

  setData(dpData);
  setActive([]);
  return dp[n][capacity];
};
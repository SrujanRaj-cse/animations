export const knapsack = async (weights, values, capacity, setData, speed, setActive, isPaused) => {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  const steps = [];
  
  for (let i = 1; i <= n; i++) {
    if (isPaused && isPaused()) return;
    
    for (let w = 1; w <= capacity; w++) {
      if (isPaused && isPaused()) return;
      
      // Highlight current cell
      setActive([i - 1, w - 1]);
      await new Promise(resolve => setTimeout(resolve, speed / 4));
      
      if (weights[i - 1] <= w) {
        const include = values[i - 1] + dp[i - 1][w - weights[i - 1]];
        const exclude = dp[i - 1][w];
        
        dp[i][w] = Math.max(include, exclude);
        
        steps.push({
          item: i - 1,
          weight: w,
          include,
          exclude,
          result: dp[i][w]
        });
      } else {
        dp[i][w] = dp[i - 1][w];
        
        steps.push({
          item: i - 1,
          weight: w,
          include: 0,
          exclude: dp[i - 1][w],
          result: dp[i][w]
        });
      }
    }
  }
  
  setActive([]);
  return { maxValue: dp[n][capacity], steps };
};

export const lcs = async (
  text1,
  text2,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

  // Fill the DP table
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (isPaused && isPaused()) return;

      // Highlight current cell being computed
      setActive([[i, j]]);
      await new Promise(resolve => setTimeout(resolve, speed));

      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        
        // Highlight diagonal cell
        setActive([[i, j], [i - 1, j - 1]]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        
        // Highlight the cells being compared
        setActive([[i, j], [i - 1, j], [i, j - 1]]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
  }

  // Update data with DP table
  const lcsData = {
    table: dp,
    text1: text1,
    text2: text2,
    result: dp[m][n]
  };

  setData(lcsData);
  setActive([]);
  return dp[m][n];
};
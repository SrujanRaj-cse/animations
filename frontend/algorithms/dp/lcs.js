export const lcs = async (str1, str2, setData, speed, setActive, isPaused) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  const steps = [];
  
  for (let i = 1; i <= m; i++) {
    if (isPaused && isPaused()) return;
    
    for (let j = 1; j <= n; j++) {
      if (isPaused && isPaused()) return;
      
      // Highlight current cell
      setActive([i - 1, j - 1]);
      await new Promise(resolve => setTimeout(resolve, speed / 4));
      
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
        
        steps.push({
          i: i - 1,
          j: j - 1,
          char1: str1[i - 1],
          char2: str2[j - 1],
          match: true,
          result: dp[i][j]
        });
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        
        steps.push({
          i: i - 1,
          j: j - 1,
          char1: str1[i - 1],
          char2: str2[j - 1],
          match: false,
          result: dp[i][j]
        });
      }
    }
  }
  
  setActive([]);
  return { length: dp[m][n], steps };
};

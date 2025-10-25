// Dynamic Programming Algorithm Animations
import { knapsack } from '../../algorithms/dp/knapsack';
import { lcs } from '../../algorithms/dp/lcs';

export const playDPAnimation = async (
  algorithm,
  data,
  target,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');

  switch (normalized) {
    case '0/1knapsack':
      // For knapsack, data should be weights array, target is capacity
      const weights = data;
      const values = data.map(w => w * 2); // Simple value calculation
      await knapsack(
        weights,
        values,
        target,
        setData,
        speed,
        setActive,
        isPaused
      );
      break;
    case 'lcs':
      // For LCS, data should be two strings
      await lcs(data[0], data[1], setData, speed, setActive, isPaused);
      break;
    case 'gridpaths':
      // For grid paths, data should be grid dimensions
      const m = data[0] || 3;
      const n = data[1] || 3;
      const grid = Array(m)
        .fill()
        .map(() => Array(n).fill(0));
      grid[0][0] = 1;
      for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
          if (i > 0) grid[i][j] += grid[i - 1][j];
          if (j > 0) grid[i][j] += grid[i][j - 1];
        }
      }
      setData({ table: grid, result: grid[m - 1][n - 1] });
      break;
    case 'coinchange':
      // For coin change, data should be coins array, target is amount
      const coins = data;
      const amount = target;
      const dp = Array(amount + 1).fill(Infinity);
      dp[0] = 0;

      for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
          if (coin <= i) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
          }
        }
      }

      setData({
        table: [dp],
        coins: coins,
        amount: amount,
        result: dp[amount] === Infinity ? -1 : dp[amount],
      });
      break;
    default:
      throw new Error(`DP algorithm ${algorithm} not implemented`);
  }
};

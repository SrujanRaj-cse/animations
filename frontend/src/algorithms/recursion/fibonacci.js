export const fibonacci = async (n, setData, speed, setActive, isPaused) => {
  const memo = {};
  const steps = [];
  
  const fibonacciHelper = async (num, depth = 0) => {
    if (isPaused && isPaused()) return;
    
    // Highlight current call
    setActive([num]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    if (num in memo) {
      steps.push({
        n: num,
        depth,
        result: memo[num],
        memoized: true
      });
      return memo[num];
    }
    
    steps.push({
      n: num,
      depth,
      result: null,
      memoized: false
    });
    
    if (num <= 1) {
      memo[num] = num;
      steps[steps.length - 1].result = num;
      return num;
    }
    
    const result = (await fibonacciHelper(num - 1, depth + 1)) + 
                  (await fibonacciHelper(num - 2, depth + 1));
    
    memo[num] = result;
    steps[steps.length - 1].result = result;
    
    return result;
  };
  
  const result = await fibonacciHelper(n);
  setActive([]);
  return { result, steps };
};

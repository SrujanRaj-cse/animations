export const factorial = async (n, setData, speed, setActive, isPaused) => {
  const steps = [];
  
  const factorialHelper = async (num, depth = 0) => {
    if (isPaused && isPaused()) return;
    
    // Highlight current call
    setActive([num]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    steps.push({
      n: num,
      depth,
      result: num <= 1 ? 1 : null
    });
    
    if (num <= 1) {
      return 1;
    }
    
    const result = num * (await factorialHelper(num - 1, depth + 1));
    
    // Update result in steps
    steps[steps.length - 1].result = result;
    
    return result;
  };
  
  const result = await factorialHelper(n);
  setActive([]);
  return { result, steps };
};

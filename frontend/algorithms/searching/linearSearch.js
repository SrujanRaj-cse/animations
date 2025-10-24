export const linearSearch = async (arr, target, setData, speed, setActive, isPaused) => {
  for (let i = 0; i < arr.length; i++) {
    if (isPaused && isPaused()) return;
    
    // Highlight current element being checked
    setActive([i]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    if (arr[i] === target) {
      // Found the target
      setActive([i]);
      return i;
    }
  }
  
  // Target not found
  setActive([]);
  return -1;
};

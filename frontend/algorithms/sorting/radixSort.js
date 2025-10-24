export const radixSort = async (arr, setData, speed, setActive, isPaused) => {
  const max = Math.max(...arr);
  const maxDigits = Math.floor(Math.log10(max)) + 1;

  for (let digit = 0; digit < maxDigits; digit++) {
    if (isPaused && isPaused()) return;
    
    // Create buckets for each digit (0-9)
    const buckets = Array.from({ length: 10 }, () => []);
    
    // Distribute elements into buckets based on current digit
    for (let i = 0; i < arr.length; i++) {
      if (isPaused && isPaused()) return;
      
      const digitValue = Math.floor(arr[i] / Math.pow(10, digit)) % 10;
      buckets[digitValue].push(arr[i]);
      
      // Highlight the element being processed
      setActive([i]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }
    
    // Collect elements from buckets back to array
    let index = 0;
    for (let bucketIndex = 0; bucketIndex < 10; bucketIndex++) {
      if (isPaused && isPaused()) return;
      
      for (let j = 0; j < buckets[bucketIndex].length; j++) {
        if (isPaused && isPaused()) return;
        
        arr[index] = buckets[bucketIndex][j];
        setActive([index]);
        setData([...arr]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
        index++;
      }
    }
  }

  setActive([]);
};

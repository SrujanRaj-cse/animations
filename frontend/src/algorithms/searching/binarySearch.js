export const binarySearch = async (arr, target, setData, speed, setActive, isPaused) => {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    if (isPaused && isPaused()) return;
    
    const mid = Math.floor((left + right) / 2);
    
    // Highlight the search range and middle element
    setActive([mid, left, right]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    if (arr[mid] === target) {
      // Found the target
      setActive([mid]);
      return mid;
    } else if (arr[mid] < target) {
      // Search right half
      left = mid + 1;
    } else {
      // Search left half
      right = mid - 1;
    }
  }
  
  // Target not found
  setActive([]);
  return -1;
};

export const heapSort = async (arr, setData, speed, setActive, isPaused) => {
  const n = arr.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    if (isPaused && isPaused()) return;
    await heapify(arr, n, i, setData, speed, setActive, isPaused);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    if (isPaused && isPaused()) return;
    
    // Move current root to end
    setActive([0, i]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    [arr[0], arr[i]] = [arr[i], arr[0]];
    setData([...arr]);
    
    // Call max heapify on the reduced heap
    await heapify(arr, i, 0, setData, speed, setActive, isPaused);
  }

  setActive([]);
};

const heapify = async (arr, n, i, setData, speed, setActive, isPaused) => {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // If left child is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // If right child is larger than largest so far
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // If largest is not root
  if (largest !== i) {
    setActive([i, largest]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    setData([...arr]);
    
    // Recursively heapify the affected sub-tree
    await heapify(arr, n, largest, setData, speed, setActive, isPaused);
  }
};

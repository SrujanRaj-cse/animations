export const bubbleSort = async (arr, setData, speed, setActive, isPaused) => {
  const n = arr.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Check for pause before each comparison
      if (isPaused && isPaused()) {
        return; // Exit early if paused
      }

      // Highlight the current pair being compared
      setActive([j, j + 1]);

      // Wait for animation delay
      await new Promise((resolve) => setTimeout(resolve, speed));

      // Compare and swap if needed
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        // Update the data state to reflect the swap
        setData([...arr]);
      }
    }

    // If no swaps occurred in this pass, the array is sorted
    if (!swapped) break;
  }

  // Clear highlights when done
  setActive([]);
};

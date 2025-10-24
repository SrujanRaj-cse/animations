export const selectionSort = async (
  arr,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (isPaused && isPaused()) return; // Check for pause

      setActive([minIndex, j]); // Highlight current min and comparison
      await new Promise((resolve) => setTimeout(resolve, speed));

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // Swap if a new min was found
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      setData([...arr]);
    }
  }

  setActive([]); // Clear highlights
};

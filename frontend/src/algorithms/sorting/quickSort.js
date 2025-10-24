export const quickSort = async (
  arr,
  setData,
  speed,
  setActive,
  isPaused,
  low = 0,
  high = arr.length - 1
) => {
  if (low < high) {
    const pi = await partition(
      arr,
      setData,
      speed,
      setActive,
      isPaused,
      low,
      high
    );

    // Recursively sort left and right partitions
    await quickSort(arr, setData, speed, setActive, isPaused, low, pi - 1);
    await quickSort(arr, setData, speed, setActive, isPaused, pi + 1, high);
  }
};

const partition = async (
  arr,
  setData,
  speed,
  setActive,
  isPaused,
  low,
  high
) => {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (isPaused && isPaused()) return i + 1; // Early exit on pause

    setActive([j, high]); // Highlight current element and pivot
    await new Promise((resolve) => setTimeout(resolve, speed));

    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      setData([...arr]);
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  setData([...arr]);
  setActive([]); // Clear highlights
  return i + 1;
};

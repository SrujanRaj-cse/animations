export const insertionSort = async (
  arr,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      if (isPaused && isPaused()) return; // Check for pause

      setActive([j, j + 1]); // Highlight shifting elements
      await new Promise((resolve) => setTimeout(resolve, speed));

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
    setData([...arr]);
  }

  setActive([]); // Clear highlights
};

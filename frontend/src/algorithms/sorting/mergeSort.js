export const mergeSort = async (
  arr,
  setData,
  speed,
  setActive,
  isPaused,
  start = 0,
  end = arr.length - 1
) => {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);

  // Recursively sort left and right halves
  await mergeSort(arr, setData, speed, setActive, isPaused, start, mid);
  await mergeSort(arr, setData, speed, setActive, isPaused, mid + 1, end);

  // Merge the sorted halves
  await merge(arr, setData, speed, setActive, isPaused, start, mid, end);
};

const merge = async (
  arr,
  setData,
  speed,
  setActive,
  isPaused,
  start,
  mid,
  end
) => {
  const left = arr.slice(start, mid + 1);
  const right = arr.slice(mid + 1, end + 1);
  let i = 0,
    j = 0,
    k = start;

  while (i < left.length && j < right.length) {
    if (isPaused && isPaused()) return; // Check for pause

    setActive([k]); // Highlight current merge position
    await new Promise((resolve) => setTimeout(resolve, speed));

    if (left[i] <= right[j]) {
      arr[k] = left[i];
      i++;
    } else {
      arr[k] = right[j];
      j++;
    }
    k++;
    setData([...arr]);
  }

  // Copy remaining elements
  while (i < left.length) {
    if (isPaused && isPaused()) return;
    setActive([k]);
    await new Promise((resolve) => setTimeout(resolve, speed));
    arr[k] = left[i];
    i++;
    k++;
    setData([...arr]);
  }

  while (j < right.length) {
    if (isPaused && isPaused()) return;
    setActive([k]);
    await new Promise((resolve) => setTimeout(resolve, speed));
    arr[k] = right[j];
    j++;
    k++;
    setData([...arr]);
  }

  setActive([]); // Clear highlights after merge
};

export const linearSearch = async (
  arr,
  target,
  setData,
  speed,
  setActive,
  isPaused
) => {
  console.log(`Starting linear search for target: ${target}`);

  for (let i = 0; i < arr.length; i++) {
    if (isPaused && isPaused()) return;

    // Highlight current element being checked
    setActive([i]);
    console.log(`Checking index ${i}, value: ${arr[i]}, target: ${target}`);
    await new Promise(resolve => setTimeout(resolve, speed));

    if (arr[i] === target) {
      // Found the target - highlight in green
      setActive([i]);
      console.log(`Found target ${target} at index ${i}`);
      await new Promise(resolve => setTimeout(resolve, speed * 2)); // Extra pause to show found
      return i;
    }
  }

  // Target not found
  console.log(`Target ${target} not found in array`);
  setActive([]);
  await new Promise(resolve => setTimeout(resolve, speed));
  return -1;
};

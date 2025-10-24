import { sleep } from "../../utils/sleep";

export async function bubbleSort(data, setData, speed) {
  const arr = [...data];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // highlight bars
      setData([
        ...arr.map((v, idx) => (idx === j || idx === j + 1 ? v + 0.0001 : v)),
      ]);
      await sleep(speed);

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        setData([...arr]);
        await sleep(speed);
      }
    }
  }

  // final draw (sorted)
  setData([...arr]);
}

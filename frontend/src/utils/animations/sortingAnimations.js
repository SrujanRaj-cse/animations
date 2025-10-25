// Sorting Algorithm Animations
import { bubbleSort } from '../../algorithms/sorting/bubbleSort';
import { selectionSort } from '../../algorithms/sorting/selectionSort';
import { insertionSort } from '../../algorithms/sorting/insertionSort';
import { mergeSort } from '../../algorithms/sorting/mergeSort';
import { quickSort } from '../../algorithms/sorting/quickSort';
import { heapSort } from '../../algorithms/sorting/heapSort';
import { radixSort } from '../../algorithms/sorting/radixSort';

export const playSortingAnimation = async (
  algorithm,
  data,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');

  switch (normalized) {
    case 'bubblesort':
      await bubbleSort([...data], setData, speed, setActive, isPaused);
      break;
    case 'selectionsort':
      await selectionSort([...data], setData, speed, setActive, isPaused);
      break;
    case 'insertionsort':
      await insertionSort([...data], setData, speed, setActive, isPaused);
      break;
    case 'mergesort':
      await mergeSort([...data], setData, speed, setActive, isPaused);
      break;
    case 'quicksort':
      await quickSort([...data], setData, speed, setActive, isPaused);
      break;
    case 'heapsort':
      await heapSort([...data], setData, speed, setActive, isPaused);
      break;
    case 'radixsort':
      await radixSort([...data], setData, speed, setActive, isPaused);
      break;
    default:
      throw new Error(`Sorting algorithm ${algorithm} not implemented`);
  }
};

// Searching Algorithm Animations
import { linearSearch } from '../../algorithms/searching/linearSearch';
import { binarySearch } from '../../algorithms/searching/binarySearch';

export const playSearchingAnimation = async (
  algorithm,
  data,
  target,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');

  if (!target) {
    throw new Error('Target value required for search algorithms');
  }

  switch (normalized) {
    case 'linearsearch':
      await linearSearch(
        [...data],
        target,
        setData,
        speed,
        setActive,
        isPaused
      );
      break;
    case 'binarysearch':
      // Binary search requires sorted array
      const sortedData = [...data].sort((a, b) => a - b);
      setData(sortedData);
      await binarySearch(
        sortedData,
        target,
        setData,
        speed,
        setActive,
        isPaused
      );
      break;
    default:
      throw new Error(`Searching algorithm ${algorithm} not implemented`);
  }
};

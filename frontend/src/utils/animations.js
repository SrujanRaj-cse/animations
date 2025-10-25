// src/utils/animations.js
import { playSortingAnimation } from './animations/sortingAnimations';
import { playSearchingAnimation } from './animations/searchingAnimations';
import { playGraphAnimation } from './animations/graphAnimations';
import { playRecursionAnimation } from './animations/recursionAnimations';
import { playDPAnimation } from './animations/dpAnimations';

/**
 * Wrapper to play algorithm animations.
 * Supports sorting and searching algorithms
 */
export const playAnimation = async (
  algorithm,
  data,
  setData,
  speed,
  setActive,
  isPaused,
  target = null
) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');
  const category = getAlgorithmCategory(algorithm);

  try {
    switch (category) {
      case 'sorting':
        await playSortingAnimation(
          algorithm,
          data,
          setData,
          speed,
          setActive,
          isPaused
        );
        break;
      case 'searching':
        await playSearchingAnimation(
          algorithm,
          data,
          target,
          setData,
          speed,
          setActive,
          isPaused
        );
        break;
      case 'graph':
        await playGraphAnimation(
          algorithm,
          data,
          0,
          5,
          setData,
          speed,
          setActive,
          isPaused
        );
        break;
      case 'recursion':
        await playRecursionAnimation(
          algorithm,
          target,
          setData,
          speed,
          setActive,
          isPaused
        );
        break;
      case 'dp':
        await playDPAnimation(
          algorithm,
          data,
          target,
          setData,
          speed,
          setActive,
          isPaused
        );
        break;
      default:
        throw new Error(
          `Animation not implemented for algorithm: ${algorithm}`
        );
    }
  } catch (error) {
    console.error(`Error playing ${algorithm} animation:`, error);
    throw error;
  }
};

/**
 * Get algorithm category based on algorithm name
 */
export const getAlgorithmCategory = algorithm => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');

  const sortingAlgorithms = [
    'bubblesort',
    'selectionsort',
    'insertionsort',
    'mergesort',
    'quicksort',
    'heapsort',
    'radixsort',
  ];

  const searchingAlgorithms = ['linearsearch', 'binarysearch'];

  const graphAlgorithms = ['bfs', 'dfs', "dijkstra's", 'a*search'];

  const recursionAlgorithms = [
    'factorial',
    'fibonacci',
    'n-queens',
    'towerofhanoi',
  ];

  const dpAlgorithms = ['0/1knapsack', 'lcs', 'gridpaths', 'coinchange'];

  if (sortingAlgorithms.includes(normalized)) {
    return 'sorting';
  } else if (searchingAlgorithms.includes(normalized)) {
    return 'searching';
  } else if (graphAlgorithms.includes(normalized)) {
    return 'graph';
  } else if (recursionAlgorithms.includes(normalized)) {
    return 'recursion';
  } else if (dpAlgorithms.includes(normalized)) {
    return 'dp';
  }

  return 'unknown';
};

/**
 * Check if algorithm requires a target value
 */
export const requiresTarget = algorithm => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');
  const targetAlgorithms = [
    'linearsearch',
    'binarysearch',
    'factorial',
    'fibonacci',
    '0/1knapsack',
    'coinchange',
  ];
  return targetAlgorithms.includes(normalized);
};

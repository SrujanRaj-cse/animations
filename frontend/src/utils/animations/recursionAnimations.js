// Recursion Algorithm Animations
import { factorial } from '../../algorithms/recursion/factorial';
import { fibonacci } from '../../algorithms/recursion/fibonacci';

export const playRecursionAnimation = async (
  algorithm,
  target,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');

  if (!target) {
    throw new Error('Target value required for recursion algorithms');
  }

  switch (normalized) {
    case 'factorial':
      await factorial(target, setData, speed, setActive, isPaused);
      break;
    case 'fibonacci':
      await fibonacci(target, setData, speed, setActive, isPaused);
      break;
    default:
      throw new Error(`Recursion algorithm ${algorithm} not implemented`);
  }
};

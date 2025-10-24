import { describe, it, expect, vi } from 'vitest';
import { bubbleSort } from '../../algorithms/sorting/bubbleSort';

describe('Bubble Sort Algorithm', () => {
  it('should sort an array correctly', async () => {
    const arr = [64, 34, 25, 12, 22, 11, 90];
    const setData = vi.fn();
    const setActive = vi.fn();
    const isPaused = vi.fn(() => false);

    await bubbleSort(arr, setData, 0, setActive, isPaused);

    expect(arr).toEqual([11, 12, 22, 25, 34, 64, 90]);
  });

  it('should handle empty array', async () => {
    const arr = [];
    const setData = vi.fn();
    const setActive = vi.fn();
    const isPaused = vi.fn(() => false);

    await bubbleSort(arr, setData, 0, setActive, isPaused);

    expect(arr).toEqual([]);
  });

  it('should handle single element array', async () => {
    const arr = [42];
    const setData = vi.fn();
    const setActive = vi.fn();
    const isPaused = vi.fn(() => false);

    await bubbleSort(arr, setData, 0, setActive, isPaused);

    expect(arr).toEqual([42]);
  });

  it('should handle already sorted array', async () => {
    const arr = [1, 2, 3, 4, 5];
    const setData = vi.fn();
    const setActive = vi.fn();
    const isPaused = vi.fn(() => false);

    await bubbleSort(arr, setData, 0, setActive, isPaused);

    expect(arr).toEqual([1, 2, 3, 4, 5]);
  });

  it('should respect pause functionality', async () => {
    const arr = [3, 1, 2];
    const setData = vi.fn();
    const setActive = vi.fn();
    const isPaused = vi.fn(() => true); // Always paused

    await bubbleSort(arr, setData, 0, setActive, isPaused);

    // Should exit early due to pause
    expect(setActive).toHaveBeenCalled();
  });
});

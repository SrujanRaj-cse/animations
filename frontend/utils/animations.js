// src/utils/animations.js
import { bubbleSort } from "../algorithms/sorting/bubbleSort";
import { selectionSort } from "../algorithms/sorting/selectionSort";
import { insertionSort } from "../algorithms/sorting/insertionSort";
import { mergeSort } from "../algorithms/sorting/mergeSort";
import { quickSort } from "../algorithms/sorting/quickSort";
import { heapSort } from "../algorithms/sorting/heapSort";
import { radixSort } from "../algorithms/sorting/radixSort";
import { linearSearch } from "../algorithms/searching/linearSearch";
import { binarySearch } from "../algorithms/searching/binarySearch";
import { bfs } from "../algorithms/graph/bfs";
import { dfs } from "../algorithms/graph/dfs";
import { dijkstra } from "../algorithms/graph/dijkstra";
import { factorial } from "../algorithms/recursion/factorial";
import { fibonacci } from "../algorithms/recursion/fibonacci";
import { knapsack } from "../algorithms/dp/knapsack";
import { lcs } from "../algorithms/dp/lcs";

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
  const normalized = algorithm.toLowerCase().replace(/\s+/g, "");

  // Sorting algorithms
  if (normalized === "bubblesort") {
    await bubbleSort([...data], setData, speed, setActive, isPaused);
  } else if (normalized === "selectionsort") {
    await selectionSort([...data], setData, speed, setActive, isPaused);
  } else if (normalized === "insertionsort") {
    await insertionSort([...data], setData, speed, setActive, isPaused);
  } else if (normalized === "mergesort") {
    await mergeSort([...data], setData, speed, setActive, isPaused);
  } else if (normalized === "quicksort") {
    await quickSort([...data], setData, speed, setActive, isPaused);
  } else if (normalized === "heapsort") {
    await heapSort([...data], setData, speed, setActive, isPaused);
  } else if (normalized === "radixsort") {
    await radixSort([...data], setData, speed, setActive, isPaused);
  }
  // Searching algorithms
  else if (normalized === "linearsearch") {
    if (!target) throw new Error("Target value required for search algorithms");
    await linearSearch([...data], target, setData, speed, setActive, isPaused);
  } else if (normalized === "binarysearch") {
    if (!target) throw new Error("Target value required for search algorithms");
    // Binary search requires sorted array
    const sortedData = [...data].sort((a, b) => a - b);
    setData(sortedData);
    await binarySearch(sortedData, target, setData, speed, setActive, isPaused);
  }
  // Graph algorithms
  else if (normalized === "bfs") {
    // For BFS, data should be a graph representation
    await bfs(data, 0, setData, speed, setActive, isPaused);
  } else if (normalized === "dfs") {
    // For DFS, data should be a graph representation
    await dfs(data, 0, setData, speed, setActive, isPaused);
  } else if (normalized === "dijkstra's") {
    // For Dijkstra's, data should be a weighted graph
    await dijkstra(data, 0, data.length - 1, setData, speed, setActive, isPaused);
  }
  // Recursion algorithms
  else if (normalized === "factorial") {
    if (!target) throw new Error("Target value required for factorial");
    await factorial(target, setData, speed, setActive, isPaused);
  } else if (normalized === "fibonacci") {
    if (!target) throw new Error("Target value required for fibonacci");
    await fibonacci(target, setData, speed, setActive, isPaused);
  }
  // Dynamic Programming algorithms
  else if (normalized === "0/1knapsack") {
    // For knapsack, data should be weights array, target is capacity
    const weights = data;
    const values = data.map(w => w * 2); // Simple value calculation
    await knapsack(weights, values, target, setData, speed, setActive, isPaused);
  } else if (normalized === "lcs") {
    // For LCS, data should be two strings
    await lcs(data[0], data[1], setData, speed, setActive, isPaused);
  } else {
    throw new Error(`Animation not implemented for algorithm: ${algorithm}`);
  }
};

/**
 * Get algorithm category based on algorithm name
 */
export const getAlgorithmCategory = (algorithm) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, "");
  
  const sortingAlgorithms = [
    "bubblesort", "selectionsort", "insertionsort", 
    "mergesort", "quicksort", "heapsort", "radixsort"
  ];
  
  const searchingAlgorithms = [
    "linearsearch", "binarysearch"
  ];
  
  const graphAlgorithms = [
    "bfs", "dfs", "dijkstra's", "a*search"
  ];
  
  const recursionAlgorithms = [
    "factorial", "fibonacci", "n-queens", "towerofhanoi"
  ];
  
  const dpAlgorithms = [
    "0/1knapsack", "lcs", "gridpaths", "coinchange"
  ];
  
  if (sortingAlgorithms.includes(normalized)) {
    return "sorting";
  } else if (searchingAlgorithms.includes(normalized)) {
    return "searching";
  } else if (graphAlgorithms.includes(normalized)) {
    return "graph";
  } else if (recursionAlgorithms.includes(normalized)) {
    return "recursion";
  } else if (dpAlgorithms.includes(normalized)) {
    return "dp";
  }
  
  return "unknown";
};

/**
 * Check if algorithm requires a target value
 */
export const requiresTarget = (algorithm) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, "");
  const targetAlgorithms = [
    "linearsearch", "binarysearch", "factorial", "fibonacci", 
    "0/1knapsack", "coinchange"
  ];
  return targetAlgorithms.includes(normalized);
};

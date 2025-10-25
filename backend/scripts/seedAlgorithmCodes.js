import mongoose from 'mongoose';
import AlgorithmCode from '../models/AlgorithmCode.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/algovisualizer';

const algorithmCodes = [
  // Sorting Algorithms
  {
    name: 'bubble-sort',
    category: 'sorting',
    code: `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swaps occurred, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`,
    description:
      'Bubble Sort - Simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
  },
  {
    name: 'selection-sort',
    category: 'sorting',
    code: `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // Find minimum element in remaining array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap if minimum is not at current position
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`,
    description:
      'Selection Sort - Finds the minimum element from the unsorted portion and places it at the beginning.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
  },
  {
    name: 'insertion-sort',
    category: 'sorting',
    code: `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}`,
    description:
      'Insertion Sort - Builds the final sorted array one item at a time by inserting each element into its correct position.',
    complexity: {
      time: 'O(n²)',
      space: 'O(1)',
    },
  },
  {
    name: 'merge-sort',
    category: 'sorting',
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    description:
      'Merge Sort - Divide and conquer algorithm that divides the array into halves, sorts them, and merges them back.',
    complexity: {
      time: 'O(n log n)',
      space: 'O(n)',
    },
  },
  {
    name: 'quick-sort',
    category: 'sorting',
    code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    description:
      'Quick Sort - Divide and conquer algorithm that picks a pivot and partitions the array around the pivot.',
    complexity: {
      time: 'O(n log n) average, O(n²) worst',
      space: 'O(log n)',
    },
  },
  {
    name: 'heap-sort',
    category: 'sorting',
    code: `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
    description:
      'Heap Sort - Uses a binary heap data structure to sort elements.',
    complexity: {
      time: 'O(n log n)',
      space: 'O(1)',
    },
  },
  {
    name: 'radix-sort',
    category: 'sorting',
    code: `function radixSort(arr) {
  const max = Math.max(...arr);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  
  return arr;
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  
  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }
  
  // Change count[i] to position of next occurrence
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  
  // Copy output back to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`,
    description:
      'Radix Sort - Non-comparative sorting algorithm that sorts data with integer keys by grouping keys by individual digits.',
    complexity: {
      time: 'O(d(n+k))',
      space: 'O(n+k)',
    },
  },
  // Searching Algorithms
  {
    name: 'linear-search',
    category: 'searching',
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
    description:
      'Linear Search - Sequentially checks each element in the list until a match is found.',
    complexity: {
      time: 'O(n)',
      space: 'O(1)',
    },
  },
  {
    name: 'binary-search',
    category: 'searching',
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`,
    description:
      'Binary Search - Efficiently finds a target value within a sorted array by repeatedly dividing the search space in half.',
    complexity: {
      time: 'O(log n)',
      space: 'O(1)',
    },
  },
  // Graph Algorithms
  {
    name: 'bfs',
    category: 'graph',
    code: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    result.push(currentNode);
    
    const neighbors = graph[currentNode] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
    description:
      'Breadth-First Search - Explores all nodes at the present depth level before moving on to nodes at the next depth level.',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
  },
  {
    name: 'dfs',
    category: 'graph',
    code: `function dfs(graph, startNode) {
  const visited = new Set();
  const result = [];
  
  const dfsHelper = (node) => {
    visited.add(node);
    result.push(node);
    
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  };
  
  dfsHelper(startNode);
  return result;
}`,
    description:
      'Depth-First Search - Explores as far as possible along each branch before backtracking.',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
  },
  {
    name: 'dijkstra',
    category: 'graph',
    code: `function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }
    
    if (current === null || current === end) break;
    unvisited.delete(current);
    
    // Update distances to neighbors
    for (const neighbor in graph[current]) {
      const distance = distances[current] + graph[current][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
      }
    }
  }
  
  return { distances, previous };
}`,
    description:
      "Dijkstra's Algorithm - Finds the shortest path between nodes in a weighted graph.",
    complexity: {
      time: 'O((V + E) log V)',
      space: 'O(V)',
    },
  },
  // Recursion Algorithms
  {
    name: 'factorial',
    category: 'recursion',
    code: `function factorial(n) {
  if (n <= 1) {
    return 1; // Base case
  }
  
  return n * factorial(n - 1); // Recursive case
}`,
    description:
      'Factorial - Calculates the factorial of a number using recursion.',
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
    },
  },
  {
    name: 'fibonacci',
    category: 'recursion',
    code: `function fibonacci(n) {
  if (n <= 1) {
    return n; // Base case
  }
  
  return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
}`,
    description:
      'Fibonacci - Calculates the nth Fibonacci number using recursion.',
    complexity: {
      time: 'O(2^n)',
      space: 'O(n)',
    },
  },
  // Dynamic Programming Algorithms
  {
    name: '0-1-knapsack',
    category: 'dp',
    code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
    description:
      '0/1 Knapsack - Solves the knapsack problem using dynamic programming.',
    complexity: {
      time: 'O(nW)',
      space: 'O(nW)',
    },
  },
  {
    name: 'lcs',
    category: 'dp',
    code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
    description:
      'Longest Common Subsequence - Finds the longest subsequence common to both strings.',
    complexity: {
      time: 'O(mn)',
      space: 'O(mn)',
    },
  },
  {
    name: 'grid-paths',
    category: 'dp',
    code: `function uniquePaths(m, n) {
  const dp = Array(m).fill().map(() => Array(n).fill(1));
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  
  return dp[m - 1][n - 1];
}`,
    description:
      'Grid Paths - Counts the number of unique paths from top-left to bottom-right in a grid.',
    complexity: {
      time: 'O(mn)',
      space: 'O(mn)',
    },
  },
  {
    name: 'coin-change',
    category: 'dp',
    code: `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    description:
      'Coin Change - Finds the minimum number of coins needed to make a given amount.',
    complexity: {
      time: 'O(amount * coins.length)',
      space: 'O(amount)',
    },
  },
];

const seedAlgorithmCodes = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing algorithm codes
    await AlgorithmCode.deleteMany({});
    console.log('🗑️ Cleared existing algorithm codes');

    // Insert new algorithm codes
    await AlgorithmCode.insertMany(algorithmCodes);
    console.log(`✅ Seeded ${algorithmCodes.length} algorithm codes`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

seedAlgorithmCodes();

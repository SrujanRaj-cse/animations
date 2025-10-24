import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Organized algorithms by category
const ALGORITHMS = {
  "Sorting": [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
    "Heap Sort",
    "Radix Sort",
  ],
  "Searching": [
    "Linear Search",
    "Binary Search",
  ],
  "Graph": [
    "BFS",
    "DFS",
    "Dijkstra's",
    "A* Search",
  ],
  "Recursion": [
    "Factorial",
    "Fibonacci",
    "N-Queens",
    "Tower of Hanoi",
  ],
  "Dynamic Programming": [
    "0/1 Knapsack",
    "LCS",
    "Grid Paths",
    "Coin Change",
  ],
};

const AlgorithmSelector = ({ selected }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (algorithmName) => {
    navigate(
      `${location.pathname}?algorithm=${encodeURIComponent(algorithmName)}`
    );
  };

  return (
    <select
      value={selected}
      onChange={(e) => handleSelect(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[200px]"
    >
      <option value="">--- Select an Algorithm ---</option>
      {Object.entries(ALGORITHMS).map(([category, algorithms]) => (
        <optgroup key={category} label={category}>
          {algorithms.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

export default AlgorithmSelector;

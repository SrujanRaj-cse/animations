import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AlgorithmSelector from "../components/AlgorithmSelector";
import CodeEditor from "../components/CodeEditor";
import VisualizerCanvas from "../components/VisualizerCanvas";
import ControlButtons from "../components/ControlButtons";
import API from "../utils/api";
import { bubbleSort } from "../algorithms/sorting/bubbleSort.js";
import { selectionSort } from "../algorithms/sorting/selectionSort";
import { insertionSort } from "../algorithms/sorting/insertionSort";
import { mergeSort } from "../algorithms/sorting/mergeSort";
import { quickSort } from "../algorithms/sorting/quickSort";

const Visualizer = () => {
  const location = useLocation();

  const [selected, setSelected] = useState("");
  const [code, setCode] = useState("// Algorithm code will appear here");
  const [data, setData] = useState([5, 3, 8, 1, 6]);
  const [active, setActive] = useState([]);
  const [sorting, setSorting] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(300);
  const [arraySize, setArraySize] = useState(15);

  const pauseRef = useRef(paused);
  pauseRef.current = paused;

  const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

  // 🔹 Update selected algorithm whenever URL query changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const algo = queryParams.get("algorithm") || "";
    setSelected(algo);
  }, [location.search]);

  // 🔹 Fetch code whenever selected changes
  useEffect(() => {
    if (!selected) return;

    setCode("// Loading...");

    const fetchCode = async () => {
      try {
        const res = await API.get(`/algorithms/sorting/${normalize(selected)}`);
        setCode(res.data.code || "// No code found for this algorithm");
      } catch (err) {
        setCode("// Failed to fetch algorithm code");
      }
    };

    fetchCode();
  }, [selected]);

  // 🔹 Play/Pause Bubble Sort animation
  const play = async () => {
    if (sorting && !paused) return;
    if (paused) {
      setPaused(false);
      return;
    }

    setSorting(true);
    setPaused(false);

    const normalized = normalize(selected);

    if (normalized === "bubblesort") {
      await bubbleSort(
        [...data],
        setData,
        speed,
        setActive,
        () => pauseRef.current
      );
    } else if (normalized === "selectionsort") {
      await selectionSort(
        [...data],
        setData,
        speed,
        setActive,
        () => pauseRef.current
      );
    } else if (normalized === "insertionsort") {
      await insertionSort(
        [...data],
        setData,
        speed,
        setActive,
        () => pauseRef.current
      );
    } else if (normalized === "mergesort") {
      await mergeSort(
        [...data],
        setData,
        speed,
        setActive,
        () => pauseRef.current
      );
    } else if (normalized === "quicksort") {
      await quickSort(
        [...data],
        setData,
        speed,
        setActive,
        () => pauseRef.current
      );
    } else {
      alert("Animation not implemented for this algorithm yet");
    }

    setSorting(false);
  };

  const pause = () => {
    if (!sorting) return;
    setPaused(true);
  };

  // Updated: Reset to original data and auto-start sorting with a delay for state sync
  const reset = () => {
    setData([5, 3, 8, 1, 6]); // Reset to initial unsorted data
    setActive([]);
    setSorting(false);
    setPaused(false);

    // Use setTimeout to ensure state updates before starting
    setTimeout(async () => {
      if (selected) {
        console.log("Reset complete, starting sort..."); // Debug log
        await play();
      } else {
        console.log("No algorithm selected for reset auto-start."); // Debug log
      }
    }, 100); // Small delay (100ms) for React to update state
  };

  const next = () => alert("Step feature not implemented yet");
  const prev = () => alert("Step-back not implemented yet");

  // Generate random data with distinct numbers only (no duplicates)
  const generateRandomData = (size) => {
    const uniqueValues = new Set();
    while (uniqueValues.size < size) {
      uniqueValues.add(Math.floor(Math.random() * 95) + 5);
    }
    return Array.from(uniqueValues);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
        Algorithm Visualizer
      </h2>

      {/* Algorithm Selector Dropdown, centered neatly */}
      <div className="mb-6 flex flex-col items-center">
        <p className="text-gray-600 mb-2">Select Algorithm</p>
        <AlgorithmSelector selected={selected} />
      </div>

      {/* Grid for Code Editor and Visualizer - WIDER GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {/* Left Panel: Code Editor */}
        <div className="h-96">
          <CodeEditor code={code} setCode={setCode} />
        </div>

        {/* Right Panel: Visualizer Canvas */}
        <div className="h-96 border border-gray-300 bg-white">
          <VisualizerCanvas data={data} active={active} />
        </div>
      </div>

      {/* Control Buttons (Centered) - SPACING FROM TOP EDITOR */}
      <div className="flex justify-center mt-8">
        <ControlButtons
          onPlay={play}
          onPause={pause}
          onNext={next}
          onPrev={prev}
          onReset={reset}
        />
      </div>

      {/* Speed Control Slider */}
      <div className="mt-6 flex justify-center gap-4 items-center">
        <label className="text-gray-600">
          Animation Speed:
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="ml-2"
          />
          <span className="ml-2">{speed}ms</span>
        </label>
      </div>

      {/* Data Generation Buttons and Array Size Input */}
      <div className="mt-6 flex justify-center gap-4 items-center">
        <label className="text-gray-600">
          Array Size:
          <input
            type="number"
            min="5"
            max="50"
            value={arraySize}
            onChange={(e) => setArraySize(Number(e.target.value))}
            className="ml-2 px-2 py-1 border rounded"
          />
        </label>

        <button
          onClick={() => setActive([])}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset Highlights
        </button>
        <button
          onClick={() => {
            setData(generateRandomData(arraySize));
            setActive([]);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Random Input
        </button>
      </div>
    </div>
  );
};

export default Visualizer;

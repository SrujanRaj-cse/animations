import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import AlgorithmSelector from "../components/AlgorithmSelector";
import CodeEditor from "../components/CodeEditor";
import VisualizerCanvas from "../components/VisualizerCanvas";
import ControlButtons from "../components/ControlButtons";
import API from "../utils/api";
import { playAnimation, getAlgorithmCategory, requiresTarget } from "../utils/animations";

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
  const [target, setTarget] = useState(5);
  const [algorithmCategory, setAlgorithmCategory] = useState("sorting");

  const pauseRef = useRef(paused);
  pauseRef.current = paused;

  const normalize = (str) => str.toLowerCase().replace(/\s+/g, "");

  // 🔹 Update selected algorithm whenever URL query changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const algo = queryParams.get("algorithm") || "";
    setSelected(algo);
    if (algo) {
      setAlgorithmCategory(getAlgorithmCategory(algo));
    }
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

  // 🔹 Play/Pause algorithm animation
  const play = async () => {
    if (sorting && !paused) return;
    if (paused) {
      setPaused(false);
      return;
    }

    if (!selected) {
      alert("Please select an algorithm first");
      return;
    }

    setSorting(true);
    setPaused(false);

    try {
      await playAnimation(
        selected,
        data,
        setData,
        speed,
        setActive,
        () => pauseRef.current,
        requiresTarget(selected) ? target : null
      );
    } catch (error) {
      alert(`Error: ${error.message}`);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Algorithm Visualizer</h1>
              <p className="text-gray-600 mt-1">Interactive step-by-step algorithm visualization</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Algorithm</p>
                <AlgorithmSelector selected={selected} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Visualization Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Code Editor Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">💻</span>
                Algorithm Implementation
              </h3>
            </div>
            <div className="h-96">
              <CodeEditor code={code} setCode={setCode} algorithm={selected} />
            </div>
          </div>

          {/* Visualization Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">📊</span>
                Visualization
                {sorting && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Running
                  </span>
                )}
              </h3>
            </div>
            <div className="h-96 p-4">
              <VisualizerCanvas 
                data={data} 
                active={active} 
                algorithm={algorithmCategory}
                target={requiresTarget(selected) ? target : null}
              />
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎮</span>
            Controls
          </h3>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <ControlButtons
              onPlay={play}
              onPause={pause}
              onNext={next}
              onPrev={prev}
              onReset={reset}
            />
          </div>
        </div>

        {/* Settings Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚙️</span>
            Settings & Data
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Speed Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Animation Speed
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-16">{speed}ms</span>
              </div>
            </div>

            {/* Array Size Control */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Array Size
              </label>
              <input
                type="number"
                min="5"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Target Input for Search Algorithms */}
            {requiresTarget(selected) && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Target Value
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Actions
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActive([])}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 text-sm"
                >
                  Clear Highlights
                </button>
                <button
                  onClick={() => {
                    setData(generateRandomData(arraySize));
                    setActive([]);
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  New Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualizer;

import React from "react";

const Controls = ({ onStart, onReset, onSpeedChange }) => {
  return (
    <div className="flex gap-3 items-center justify-center my-4">
      <button
        onClick={onStart}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Start Sorting
      </button>
      <button
        onClick={onReset}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
      >
        Reset
      </button>
      <label className="text-sm">
        Speed:
        <input
          type="range"
          min="10"
          max="500"
          defaultValue="200"
          onChange={(e) => onSpeedChange(e.target.value)}
          className="ml-2"
        />
      </label>
    </div>
  );
};

export default Controls;

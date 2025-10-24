// ControlButtons.jsx
import React from "react";

const ControlButtons = ({ onPlay, onPause, onPrev, onNext, onReset }) => {
  return (
    <div className="flex justify-center space-x-3">
      <button
        onClick={onPlay}
        className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
      >
        <span className="mr-2">▶</span>
        Play
      </button>
      <button
        onClick={onPause}
        className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
      >
        <span className="mr-2">⏸</span>
        Pause
      </button>
      <button
        onClick={onReset}
        className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
      >
        <span className="mr-2">🔄</span>
        Reset
      </button>
      <button
        onClick={onPrev}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
      >
        <span className="mr-2">⏮</span>
        Prev
      </button>
      <button
        onClick={onNext}
        className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
      >
        <span className="mr-2">⏭</span>
        Next
      </button>
    </div>
  );
};

export default ControlButtons;

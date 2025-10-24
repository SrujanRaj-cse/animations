// ControlButtons.jsx
import React from "react";

const ControlButtons = ({ onPlay, onPause, onPrev, onNext }) => {
  return (
    <div className="flex justify-center space-x-4">
      <button
        onClick={onPlay}
        className="text-blue-600 hover:text-blue-800 flex items-center"
      >
        ▶ Play
      </button>
      <button
        onClick={onPause}
        className="text-gray-600 hover:text-gray-800 flex items-center"
      >
        ⏸ Pause
      </button>
      <button
        onClick={onPrev}
        className="text-gray-600 hover:text-gray-800 flex items-center"
      >
        ⏮ Prev
      </button>
      <button
        onClick={onNext}
        className="text-gray-600 hover:text-gray-800 flex items-center"
      >
        ⏭ Next
      </button>
    </div>
  );
};

export default ControlButtons;

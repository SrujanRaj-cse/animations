import React, { useRef, useEffect } from "react";

const VisualizerCanvas = ({ data, active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) return; // No data to draw

    const maxValue = Math.max(...data);
    const barWidth = canvas.width / data.length; // Fill horizontal space
    const margin = 30; // Space at top for numbers and padding

    data.forEach((value, index) => {
      // Scale height: tallest bar fills most of the canvas height
      const barHeight = (value / maxValue) * (canvas.height - margin);
      const x = index * barWidth;
      const y = canvas.height - barHeight;

      // Draw bar with color based on active state
      ctx.fillStyle = active.includes(index) ? "#ff6b6b" : "#4ecdc4"; // Red for active, teal for inactive
      ctx.fillRect(x + 1, y, barWidth - 2, barHeight); // +1 and -2 for small gaps

      // Draw number on top of the bar
      ctx.fillStyle = "#333"; // Dark text for contrast
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5); // Position above the bar
    });
  }, [data, active]); // Redraw on data or active changes

  return (
    <canvas
      ref={canvasRef}
      width={800} // Fixed width; adjust as needed for responsiveness
      height={384} // Matches h-96 (384px in Tailwind)
      className="w-full h-full" // Makes it responsive within the parent div
    />
  );
};

export default VisualizerCanvas;

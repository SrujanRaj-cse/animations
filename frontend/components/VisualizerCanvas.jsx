import React, { useRef, useEffect } from "react";

const VisualizerCanvas = ({ data, active, algorithm = "sorting", target = null }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (data.length === 0) return;

    const maxValue = Math.max(...data);
    const barWidth = canvas.width / data.length;
    const margin = 40;

    data.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height - margin);
      const x = index * barWidth;
      const y = canvas.height - barHeight;

      // Determine color based on algorithm type and state
      let fillColor = "#4ecdc4"; // Default teal
      
      if (active.includes(index)) {
        if (algorithm === "searching") {
          fillColor = value === target ? "#4ade80" : "#f87171"; // Green if found, red if not
        } else {
          fillColor = "#3b82f6"; // Blue for sorting
        }
      } else if (algorithm === "searching" && value === target) {
        fillColor = "#fbbf24"; // Yellow for target value
      }

      // Draw bar with gradient effect
      const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, fillColor + "80"); // Add transparency
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

      // Add border
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y, barWidth - 4, barHeight);

      // Draw number on top of the bar
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });

    // Add algorithm-specific annotations
    if (algorithm === "searching" && target !== null) {
      ctx.fillStyle = "#dc2626";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`Target: ${target}`, 10, 20);
    }

  }, [data, active, algorithm, target]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={384}
      className="w-full h-full rounded-lg"
    />
  );
};

export default VisualizerCanvas;

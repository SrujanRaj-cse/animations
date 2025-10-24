import React, { useRef, useEffect } from "react";

const VisualizerCanvas = ({ data, active, algorithm = "sorting", target = null, graphData = null, recursionData = null }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw based on algorithm type
    switch (algorithm) {
      case "sorting":
      case "searching":
        drawBarChart(ctx, canvas, data, active, algorithm, target);
        break;
      case "graph":
        drawGraph(ctx, canvas, graphData || data, active);
        break;
      case "recursion":
        drawRecursionTree(ctx, canvas, recursionData || data, active);
        break;
      case "dp":
        drawDPTable(ctx, canvas, data, active);
        break;
      default:
        drawBarChart(ctx, canvas, data, active, algorithm, target);
    }

  }, [data, active, algorithm, target, graphData, recursionData]);

  // Bar chart for sorting and searching algorithms
  const drawBarChart = (ctx, canvas, data, active, algorithm, target) => {
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
  };

  // Graph visualization for BFS, DFS, Dijkstra
  const drawGraph = (ctx, canvas, graphData, active) => {
    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];
    const visited = active || [];

    // Draw edges first
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 2;
    edges.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      const isVisited = visited.includes(index);
      const isCurrent = visited[visited.length - 1] === index;

      // Node color based on state
      let fillColor = "#4ecdc4"; // Default
      if (isCurrent) {
        fillColor = "#3b82f6"; // Current node
      } else if (isVisited) {
        fillColor = "#10b981"; // Visited
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label || index.toString(), node.x, node.y);
    });
  };

  // Recursion tree visualization
  const drawRecursionTree = (ctx, canvas, recursionData, active) => {
    const treeData = recursionData.tree || [];
    const currentPath = active || [];

    // Draw tree nodes and connections
    treeData.forEach((node, index) => {
      const isInPath = currentPath.includes(index);
      const isCurrent = currentPath[currentPath.length - 1] === index;

      // Node color
      let fillColor = "#4ecdc4";
      if (isCurrent) {
        fillColor = "#3b82f6";
      } else if (isInPath) {
        fillColor = "#10b981";
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node value
      ctx.fillStyle = "#1f2937";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.value.toString(), node.x, node.y);

      // Draw connection to parent
      if (node.parent !== null) {
        const parent = treeData[node.parent];
        ctx.strokeStyle = "#6b7280";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y - 15);
        ctx.lineTo(parent.x, parent.y + 15);
        ctx.stroke();
      }
    });
  };

  // Dynamic Programming table visualization
  const drawDPTable = (ctx, canvas, tableData, active) => {
    const table = tableData.table || [];
    const rows = table.length;
    const cols = table[0]?.length || 0;

    if (rows === 0 || cols === 0) return;

    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    table.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellWidth;
        const y = rowIndex * cellHeight;
        const isActive = active.some(pos => pos[0] === rowIndex && pos[1] === colIndex);

        // Cell color
        const fillColor = isActive ? "#3b82f6" : "#f3f4f6";

        // Draw cell
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = "#1f2937";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        // Draw cell value
        ctx.fillStyle = "#1f2937";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(cell.toString(), x + cellWidth / 2, y + cellHeight / 2);
      });
    });
  };

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

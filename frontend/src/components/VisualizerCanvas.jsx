import React, { useRef, useEffect } from 'react';

const VisualizerCanvas = ({
  data,
  active,
  algorithm = 'sorting',
  target = null,
  graphData = null,
  recursionData = null,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw based on algorithm type
    switch (algorithm) {
      case 'sorting':
      case 'searching':
        drawBarChart(ctx, canvas, data, active, algorithm, target);
        break;
      case 'graph':
        drawGraph(ctx, canvas, graphData || data, active);
        break;
      case 'recursion':
        drawRecursionTree(ctx, canvas, recursionData || data, active);
        break;
      case 'dp':
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
      let fillColor = '#4ecdc4'; // Default teal

      if (active.includes(index)) {
        if (algorithm === 'searching') {
          fillColor = value === target ? '#4ade80' : '#f87171'; // Green if found, red if not
        } else {
          fillColor = '#3b82f6'; // Blue for sorting
        }
      } else if (algorithm === 'searching' && value === target) {
        fillColor = '#fbbf24'; // Yellow for target value
      }

      // Draw bar with gradient effect
      const gradient = ctx.createLinearGradient(0, y, 0, canvas.height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, fillColor + '80'); // Add transparency

      ctx.fillStyle = gradient;
      ctx.fillRect(x + 2, y, barWidth - 4, barHeight);

      // Add border
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y, barWidth - 4, barHeight);

      // Draw number on top of the bar
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
    });

    // Add algorithm-specific annotations
    if (algorithm === 'searching' && target !== null) {
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Target: ${target}`, 10, 20);
    }
  };

  // Graph visualization for BFS, DFS, Dijkstra
  const drawGraph = (ctx, canvas, graphData, active) => {
    const nodes = graphData.nodes || [];
    const edges = graphData.edges || [];
    const visited = active || [];
    const path = graphData.path || [];
    const current = graphData.current;
    const exploring = graphData.exploring;
    const stack = graphData.stack || [];

    // Draw edges first
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 2;
    edges.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      if (fromNode && toNode) {
        // Check if this edge is part of the shortest path
        const isPathEdge =
          path.includes(edge.from) &&
          path.includes(edge.to) &&
          Math.abs(path.indexOf(edge.from) - path.indexOf(edge.to)) === 1;

        // Check if this edge is being explored
        const isExploringEdge =
          (current === edge.from && exploring === edge.to) ||
          (current === edge.to && exploring === edge.from);

        if (isPathEdge) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 3;
        } else if (isExploringEdge) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 2;
        }

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Draw edge weight for Dijkstra
        if (edge.weight) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;
          ctx.fillStyle = '#1f2937';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.weight.toString(), midX, midY - 5);
        }
      }
    });

    // Draw nodes
    nodes.forEach((node, index) => {
      const isVisited = visited.includes(index);
      const isCurrent = current === index;
      const isExploring = exploring === index;
      const isInPath = path.includes(index);
      const isInStack = stack.includes(index);

      // Node color based on state
      let fillColor = '#4ecdc4'; // Default
      let borderColor = '#1f2937';
      let borderWidth = 2;

      if (isInPath) {
        fillColor = '#ef4444'; // Path node
        borderColor = '#dc2626';
        borderWidth = 3;
      } else if (isCurrent) {
        fillColor = '#3b82f6'; // Current node
        borderColor = '#2563eb';
        borderWidth = 3;
      } else if (isExploring) {
        fillColor = '#f59e0b'; // Exploring node
        borderColor = '#d97706';
        borderWidth = 3;
      } else if (isVisited) {
        fillColor = '#10b981'; // Visited
        borderColor = '#059669';
        borderWidth = 2;
      } else if (isInStack) {
        fillColor = '#8b5cf6'; // In stack
        borderColor = '#7c3aed';
        borderWidth = 2;
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label || index.toString(), node.x, node.y);
    });

    // Draw algorithm info
    if (graphData.algorithm) {
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Algorithm: ${graphData.algorithm}`, 10, 10);
    }

    // Draw stack info for DFS
    if (stack && stack.length > 0) {
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Stack: [${stack.join(', ')}]`, 10, 30);
    }

    // Draw visited order
    if (visited && visited.length > 0) {
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Visited: [${visited.join(', ')}]`, 10, 50);
    }
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
      let fillColor = '#4ecdc4';
      if (isCurrent) {
        fillColor = '#3b82f6';
      } else if (isInPath) {
        fillColor = '#10b981';
      }

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, 2 * Math.PI);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node value
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.value.toString(), node.x, node.y);

      // Draw connection to parent
      if (node.parent !== null) {
        const parent = treeData[node.parent];
        ctx.strokeStyle = '#6b7280';
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

    // Draw table headers if available
    if (tableData.weights && tableData.values) {
      // Knapsack visualization
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Draw weight labels
      for (let i = 0; i < tableData.weights.length; i++) {
        ctx.fillText(
          `W:${tableData.weights[i]}`,
          (i + 1) * cellWidth + cellWidth / 2,
          15
        );
      }

      // Draw capacity labels
      for (let j = 0; j < tableData.capacity + 1; j++) {
        ctx.fillText(j.toString(), j * cellWidth + cellWidth / 2, 30);
      }
    }

    table.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = colIndex * cellWidth;
        const y = rowIndex * cellHeight + (tableData.weights ? 40 : 0);
        const isActive = active.some(
          pos => pos[0] === rowIndex && pos[1] === colIndex
        );

        // Cell color
        let fillColor = '#f3f4f6';
        if (isActive) {
          fillColor = '#3b82f6';
        } else if (rowIndex === 0 || colIndex === 0) {
          fillColor = '#e5e7eb'; // Header cells
        }

        // Draw cell
        ctx.fillStyle = fillColor;
        ctx.fillRect(x, y, cellWidth, cellHeight);
        ctx.strokeStyle = '#1f2937';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        // Draw cell value
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cell.toString(), x + cellWidth / 2, y + cellHeight / 2);
      });
    });

    // Draw result if available
    if (tableData.result !== undefined) {
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(`Result: ${tableData.result}`, 10, canvas.height - 30);
    }
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

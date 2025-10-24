export const bfs = async (graphData, startNode, setData, speed, setActive, isPaused) => {
  // Create a sample graph if none provided
  const graph = graphData.graph || {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4]
  };

  const visited = new Set();
  const queue = [startNode];
  const result = [];
  const visitedOrder = [];
  
  visited.add(startNode);
  visitedOrder.push(startNode);
  
  while (queue.length > 0) {
    if (isPaused && isPaused()) return;
    
    const currentNode = queue.shift();
    result.push(currentNode);
    
    // Highlight current node and all visited nodes
    setActive([...visitedOrder]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Visit all neighbors
    const neighbors = graph[currentNode] || [];
    for (const neighbor of neighbors) {
      if (isPaused && isPaused()) return;
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        visitedOrder.push(neighbor);
        queue.push(neighbor);
        
        // Highlight the edge being explored
        setActive([...visitedOrder]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
  }
  
  // Update the graph data with visited information
  const updatedGraphData = {
    ...graphData,
    nodes: graphData.nodes || generateGraphNodes(graph),
    edges: graphData.edges || generateGraphEdges(graph),
    visited: visitedOrder
  };
  
  setData(updatedGraphData);
  setActive([]);
  return result;
};

// Helper function to generate node positions for visualization
const generateGraphNodes = (graph) => {
  const nodeCount = Object.keys(graph).length;
  const nodes = [];
  const centerX = 400;
  const centerY = 200;
  const radius = 150;
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    nodes.push({
      x: x,
      y: y,
      label: i.toString()
    });
  }
  
  return nodes;
};

// Helper function to generate edges for visualization
const generateGraphEdges = (graph) => {
  const edges = [];
  const visited = new Set();
  
  for (const [from, neighbors] of Object.entries(graph)) {
    for (const to of neighbors) {
      const edgeKey = `${Math.min(from, to)}-${Math.max(from, to)}`;
      if (!visited.has(edgeKey)) {
        edges.push({
          from: parseInt(from),
          to: parseInt(to)
        });
        visited.add(edgeKey);
      }
    }
  }
  
  return edges;
};

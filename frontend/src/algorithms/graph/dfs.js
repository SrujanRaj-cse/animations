export const dfs = async (
  graphData,
  startNode,
  setData,
  speed,
  setActive,
  isPaused
) => {
  // Create a sample graph if none provided
  const graph = graphData.graph || {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4],
  };

  const visited = new Set();
  const result = [];
  const visitedOrder = [];
  const stack = [startNode];

  console.log(`Starting DFS from node ${startNode}`);

  // First, show the initial graph
  const initialGraphData = {
    ...graphData,
    nodes: graphData.nodes || generateGraphNodes(graph),
    edges: graphData.edges || generateGraphEdges(graph),
    visited: [],
    current: null,
    stack: [startNode],
  };
  setData(initialGraphData);
  setActive([]);
  await new Promise(resolve => setTimeout(resolve, speed));

  const dfsHelper = async node => {
    if (isPaused && isPaused()) return;

    console.log(`Visiting node ${node}`);
    visited.add(node);
    result.push(node);
    visitedOrder.push(node);

    // Update stack
    const currentStack = [...stack];
    if (currentStack.includes(node)) {
      currentStack.splice(currentStack.indexOf(node), 1);
    }

    // Highlight current node and all visited nodes
    setActive([...visitedOrder]);

    const updatedGraphData = {
      ...graphData,
      nodes: graphData.nodes || generateGraphNodes(graph),
      edges: graphData.edges || generateGraphEdges(graph),
      visited: visitedOrder,
      current: node,
      stack: currentStack,
    };
    setData(updatedGraphData);

    await new Promise(resolve => setTimeout(resolve, speed));

    const neighbors = graph[node] || [];
    console.log(
      `Exploring neighbors of node ${node}: [${neighbors.join(', ')}]`
    );

    for (const neighbor of neighbors) {
      if (isPaused && isPaused()) return;

      console.log(`Checking neighbor ${neighbor} of node ${node}`);

      if (!visited.has(neighbor)) {
        // Add to stack
        currentStack.push(neighbor);

        // Highlight the edge being explored
        setActive([...visitedOrder, neighbor]);

        const edgeGraphData = {
          ...graphData,
          nodes: graphData.nodes || generateGraphNodes(graph),
          edges: graphData.edges || generateGraphEdges(graph),
          visited: visitedOrder,
          current: node,
          exploring: neighbor,
          stack: currentStack,
        };
        setData(edgeGraphData);

        await new Promise(resolve => setTimeout(resolve, speed / 2));

        await dfsHelper(neighbor);
      } else {
        console.log(`Neighbor ${neighbor} already visited`);
      }
    }
  };

  await dfsHelper(startNode);

  // Final state
  const finalGraphData = {
    ...graphData,
    nodes: graphData.nodes || generateGraphNodes(graph),
    edges: graphData.edges || generateGraphEdges(graph),
    visited: visitedOrder,
    current: null,
    stack: [],
  };

  setData(finalGraphData);
  setActive([]);
  console.log(`DFS completed. Visited order: [${visitedOrder.join(', ')}]`);
  return result;
};

// Helper function to generate node positions for visualization
const generateGraphNodes = graph => {
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
      label: i.toString(),
    });
  }

  return nodes;
};

// Helper function to generate edges for visualization
const generateGraphEdges = graph => {
  const edges = [];
  const visited = new Set();

  for (const [from, neighbors] of Object.entries(graph)) {
    for (const to of neighbors) {
      const edgeKey = `${Math.min(from, to)}-${Math.max(from, to)}`;
      if (!visited.has(edgeKey)) {
        edges.push({
          from: parseInt(from),
          to: parseInt(to),
        });
        visited.add(edgeKey);
      }
    }
  }

  return edges;
};

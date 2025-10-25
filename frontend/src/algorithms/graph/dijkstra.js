export const dijkstra = async (
  graphData,
  startNode,
  endNode,
  setData,
  speed,
  setActive,
  isPaused
) => {
  // Create a sample weighted graph if none provided
  const graph = graphData.graph || {
    0: { 1: 4, 2: 1 },
    1: { 0: 4, 2: 2, 3: 5 },
    2: { 0: 1, 1: 2, 3: 8, 4: 10 },
    3: { 1: 5, 2: 8, 4: 2, 5: 6 },
    4: { 2: 10, 3: 2, 5: 3 },
    5: { 3: 6, 4: 3 }
  };

  const distances = {};
  const previous = {};
  const unvisited = new Set();
  const visitedOrder = [];
  const path = [];

  // Initialize distances
  for (const node in graph) {
    distances[node] = node === startNode.toString() ? 0 : Infinity;
    unvisited.add(node);
  }

  while (unvisited.size > 0) {
    if (isPaused && isPaused()) return;

    // Find unvisited node with minimum distance
    let current = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }

    if (current === null) break;

    // Mark current node as visited
    unvisited.delete(current);
    visitedOrder.push(parseInt(current));

    // Highlight current node and all visited nodes
    setActive([...visitedOrder]);
    await new Promise(resolve => setTimeout(resolve, speed));

    // Update distances to neighbors
    for (const neighbor in graph[current]) {
      if (isPaused && isPaused()) return;

      const distance = distances[current] + graph[current][neighbor];
      
      // Highlight the edge being explored
      setActive([...visitedOrder, parseInt(neighbor)]);
      await new Promise(resolve => setTimeout(resolve, speed / 2));

      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
        
        // Highlight updated distance
        setActive([...visitedOrder, parseInt(neighbor)]);
        await new Promise(resolve => setTimeout(resolve, speed / 3));
      }
    }

    if (current === endNode.toString()) break;
  }

  // Reconstruct path
  let current = endNode.toString();
  while (current !== undefined) {
    path.unshift(parseInt(current));
    current = previous[current];
  }

  // Update the graph data with visited information and path
  const updatedGraphData = {
    ...graphData,
    nodes: graphData.nodes || generateGraphNodes(graph),
    edges: graphData.edges || generateGraphEdges(graph),
    visited: visitedOrder,
    path: path,
    distances: distances
  };

  setData(updatedGraphData);
  setActive([]);
  return { distances, previous, path };
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
      label: i.toString(),
    });
  }

  return nodes;
};

// Helper function to generate edges for visualization
const generateGraphEdges = (graph) => {
  const edges = [];
  const visited = new Set();

  for (const [from, neighbors] of Object.entries(graph)) {
    for (const to of Object.keys(neighbors)) {
      const edgeKey = `${Math.min(from, to)}-${Math.max(from, to)}`;
      if (!visited.has(edgeKey)) {
        edges.push({
          from: parseInt(from),
          to: parseInt(to),
          weight: neighbors[to]
        });
        visited.add(edgeKey);
      }
    }
  }

  return edges;
};
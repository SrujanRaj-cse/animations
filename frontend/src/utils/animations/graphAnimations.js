// Graph Algorithm Animations
import { bfs } from '../../algorithms/graph/bfs';
import { dfs } from '../../algorithms/graph/dfs';
import { dijkstra } from '../../algorithms/graph/dijkstra';

export const playGraphAnimation = async (
  algorithm,
  graphData,
  startNode,
  endNode,
  setData,
  speed,
  setActive,
  isPaused
) => {
  const normalized = algorithm.toLowerCase().replace(/\s+/g, '');

  // Create a sample graph if none provided
  const graph = graphData.graph || {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1, 5],
    5: [2, 4],
  };

  // Initialize graph data with nodes and edges
  const initialGraphData = {
    ...graphData,
    graph: graph,
    nodes: graphData.nodes || generateGraphNodes(graph),
    edges: graphData.edges || generateGraphEdges(graph),
  };

  setData(initialGraphData);

  switch (normalized) {
    case 'bfs':
      await bfs(
        initialGraphData,
        startNode || 0,
        setData,
        speed,
        setActive,
        isPaused
      );
      break;
    case 'dfs':
      await dfs(
        initialGraphData,
        startNode || 0,
        setData,
        speed,
        setActive,
        isPaused
      );
      break;
    case 'dijkstra':
    case "dijkstra's":
      await dijkstra(
        initialGraphData,
        startNode || 0,
        endNode || 5,
        setData,
        speed,
        setActive,
        isPaused
      );
      break;
    default:
      throw new Error(`Graph algorithm ${algorithm} not implemented`);
  }
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

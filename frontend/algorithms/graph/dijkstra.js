export const dijkstra = async (graph, startNode, endNode, setData, speed, setActive, isPaused) => {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === startNode ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    if (isPaused && isPaused()) return;
    
    // Find node with minimum distance
    let currentNode = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        currentNode = node;
      }
    }
    
    if (currentNode === null) break;
    
    unvisited.delete(currentNode);
    
    // Highlight current node
    setActive([currentNode]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Update distances to neighbors
    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      if (isPaused && isPaused()) return;
      
      if (unvisited.has(neighbor)) {
        const edgeWeight = neighbors[neighbor];
        const newDistance = distances[currentNode] + edgeWeight;
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = currentNode;
          
          // Highlight the edge being updated
          setActive([currentNode, neighbor]);
          await new Promise(resolve => setTimeout(resolve, speed / 2));
        }
      }
    }
  }
  
  // Reconstruct path
  const path = [];
  let current = endNode;
  while (current !== null) {
    path.unshift(current);
    current = previous[current];
  }
  
  setActive([]);
  return { path, distance: distances[endNode] };
};

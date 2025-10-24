export const bfs = async (graph, startNode, setData, speed, setActive, isPaused) => {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    if (isPaused && isPaused()) return;
    
    const currentNode = queue.shift();
    result.push(currentNode);
    
    // Highlight current node
    setActive([currentNode]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Visit all neighbors
    const neighbors = graph[currentNode] || [];
    for (const neighbor of neighbors) {
      if (isPaused && isPaused()) return;
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        
        // Highlight the edge being explored
        setActive([currentNode, neighbor]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
      }
    }
  }
  
  setActive([]);
  return result;
};

export const dfs = async (graph, startNode, setData, speed, setActive, isPaused) => {
  const visited = new Set();
  const result = [];
  
  const dfsHelper = async (node) => {
    if (isPaused && isPaused()) return;
    
    visited.add(node);
    result.push(node);
    
    // Highlight current node
    setActive([node]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    // Visit all neighbors
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (isPaused && isPaused()) return;
      
      if (!visited.has(neighbor)) {
        // Highlight the edge being explored
        setActive([node, neighbor]);
        await new Promise(resolve => setTimeout(resolve, speed / 2));
        
        await dfsHelper(neighbor);
      }
    }
  };
  
  await dfsHelper(startNode);
  setActive([]);
  return result;
};

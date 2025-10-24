export const factorial = async (n, setData, speed, setActive, isPaused) => {
  const tree = [];
  const callStack = [];
  let nodeId = 0;
  
  const factorialHelper = async (num, depth = 0, parentId = null) => {
    if (isPaused && isPaused()) return;
    
    const currentNodeId = nodeId++;
    const x = 400 + (depth - 2) * 120;
    const y = 100 + depth * 80;
    
    // Add node to tree
    const node = {
      id: currentNodeId,
      value: num,
      x: x,
      y: y,
      parent: parentId,
      result: null,
      depth: depth
    };
    
    tree.push(node);
    callStack.push(currentNodeId);
    
    // Highlight current call path
    setActive([...callStack]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    if (num <= 1) {
      node.result = 1;
      callStack.pop();
      return 1;
    }
    
    const result = num * (await factorialHelper(num - 1, depth + 1, currentNodeId));
    
    // Update result in tree
    node.result = result;
    
    // Highlight return path
    setActive([...callStack]);
    await new Promise(resolve => setTimeout(resolve, speed / 2));
    
    callStack.pop();
    return result;
  };
  
  const result = await factorialHelper(n);
  
  // Update data with tree structure
  const recursionData = {
    tree: tree,
    result: result,
    algorithm: 'factorial'
  };
  
  setData(recursionData);
  setActive([]);
  return { result, tree };
};

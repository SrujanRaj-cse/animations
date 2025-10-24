export const fibonacci = async (n, setData, speed, setActive, isPaused) => {
  const memo = {};
  const tree = [];
  const callStack = [];
  let nodeId = 0;
  
  const fibonacciHelper = async (num, depth = 0, parentId = null) => {
    if (isPaused && isPaused()) return;
    
    const currentNodeId = nodeId++;
    const x = 400 + (depth - 3) * 100;
    const y = 100 + depth * 60;
    
    // Add node to tree
    const node = {
      id: currentNodeId,
      value: num,
      x: x,
      y: y,
      parent: parentId,
      result: null,
      depth: depth,
      memoized: false
    };
    
    tree.push(node);
    callStack.push(currentNodeId);
    
    // Highlight current call path
    setActive([...callStack]);
    await new Promise(resolve => setTimeout(resolve, speed));
    
    if (num in memo) {
      node.result = memo[num];
      node.memoized = true;
      callStack.pop();
      return memo[num];
    }
    
    if (num <= 1) {
      memo[num] = num;
      node.result = num;
      callStack.pop();
      return num;
    }
    
    const result = (await fibonacciHelper(num - 1, depth + 1, currentNodeId)) + 
                  (await fibonacciHelper(num - 2, depth + 1, currentNodeId));
    
    memo[num] = result;
    node.result = result;
    
    // Highlight return path
    setActive([...callStack]);
    await new Promise(resolve => setTimeout(resolve, speed / 2));
    
    callStack.pop();
    return result;
  };
  
  const result = await fibonacciHelper(n);
  
  // Update data with tree structure
  const recursionData = {
    tree: tree,
    result: result,
    algorithm: 'fibonacci'
  };
  
  setData(recursionData);
  setActive([]);
  return { result, tree };
};

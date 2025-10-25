import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import models
import User from './models/User.js';
import VisualizationStep from './models/VisualizationStep.js';
import Algorithm from './models/Algorithm.js';
import UserProgress from './models/UserProgress.js';
import Achievement from './models/Achievement.js';
import AlgorithmCode from './models/AlgorithmCode.js';

// Import algorithm execution logic
import runBubbleSort from './sorts/bubbleSort/index.js';

import runInorderTrav from './binaryTree/traversals/inorderIndex.js';
import runNQueenSteps from './recursions/NQueen/NQueen.index.js';
import runGridPaths2Steps from './dynamicProgramming/GridPaths2/gridPaths2.index.js';

// Load environment variables
const app = express();

// ✅ Then use middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
const port = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/algovisualizer';
const JWT_SECRET = process.env.ENV_SECRET || 'your-super-secret-jwt-key'; // Assuming ENV_SECRET is correct

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Security middleware
app.use(helmet());
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5174',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// User Registration
app.post('/api/auth/register', async (req, res) => {
  // 1. LOGGING: Log received data for debugging
  console.log('Received registration request body:', req.body);
  let { username, email, password, firstName, lastName } = req.body; // 2. USERNAME FALLBACK: Check and fix username if missing or invalid based on schema
  console.log('ACAJDWOHWO');
  let finalUsername = username;
  if (!finalUsername || finalUsername.length < 3) {
    // Create a basic username from email, stripping invalid characters
    const baseUsername = email ? email.split('@')[0] : '';
    finalUsername = baseUsername.replace(/[^a-zA-Z0-9_]/g, '');

    if (finalUsername.length < 3) {
      // Fallback to a timestamped user if email prefix is too short
      finalUsername = `user_${Date.now()}`.substring(0, 30);
    }
  }

  try {
    // Check if user already exists (using the final username)
    const existingUser = await User.findOne({
      $or: [{ email }, { username: finalUsername }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
        field: existingUser.email === email ? 'email' : 'username',
      });
    } // Create new user

    const newUser = new User({
      username: finalUsername, // Use the corrected username
      email,
      password,
      profile: { firstName, lastName },
    });

    await newUser.save(); // Hashing happens here (in the User model hook) // Generate JWT token

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        profile: newUser.profile,
      },
    });
  } catch (error) {
    // 3. ENHANCED ERROR LOGGING
    console.error(
      'Registration error (detailed):',
      error.message,
      error.errors
    );

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors,
      });
    }

    res.status(500).json({ message: 'Server error during registration' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body; // <--- It expects email and password

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    } // Check if user is active

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    } // Compare password

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    } // Update last login

    user.lastLogin = new Date();
    await user.save(); // Generate JWT token

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        statistics: user.statistics,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile,
        preferences: user.preferences,
        statistics: user.statistics,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { profile, preferences } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (profile) {
      user.profile = { ...user.profile, ...profile };
    }

    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/visualizations/save', async (req, res) => {
  const {
    userId,
    algorithmName,
    steps,
    inputDescription,
    nSize,
    gridMatrix,
    headNode,
  } = req.body;

  if (!userId || !steps || !algorithmName) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newVis = new VisualizationStep({
      userId,
      algorithmName,
      steps,
      inputDescription: inputDescription || 'Custom execution',
      nSize,
      gridMatrix,
      headNode,
    });
    await newVis.save();
    res.status(201).json({
      message: 'Visualization steps saved successfully',
      visId: newVis._id,
    });
  } catch (error) {
    console.error('Save steps error:', error);
    res.status(500).json({ message: 'Failed to save visualization steps' });
  }
});

app.get('/api/visualizations/step/:visId', async (req, res) => {
  const { visId } = req.params;

  try {
    const visualization = await VisualizationStep.findById(visId);
    if (!visualization) {
      return res.status(404).json({ message: 'Visualization not found' });
    } // Return the full saved object, including the 'steps' array
    res.status(200).json(visualization);
  } catch (error) {
    console.error('Load specific step error:', error);
    res
      .status(500)
      .json({ message: 'Failed to load specific visualization step' });
  }
});

// http://localhost:3000/ is default // need to change
// Enhanced sorting algorithms endpoint
app.post('/api/visualize/sorts/:algorithm', (req, res) => {
  const { algorithm } = req.params;
  const { code, input } = req.body;

  try {
    let steps;

    switch (algorithm.toLowerCase()) {
      case 'bubble-sort':
        steps = runBubbleSort(code, input);
        break;
      default:
        return res.status(400).json({
          error: `Algorithm ${algorithm} not implemented`,
        });
    }

    res.json({
      algorithm,
      steps,
      inputSize: input ? input.length : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error executing ${algorithm}:`, error);
    res.status(500).json({
      error: 'Algorithm execution failed',
      message: error.message,
    });
  }
});
// Enhanced tree traversal endpoint
app.post('/api/visualize/traversals/:type', (req, res) => {
  const { type } = req.params;
  const { code, node } = req.body;

  try {
    let steps;

    switch (type.toLowerCase()) {
      case 'inorder':
        steps = runInorderTrav(code, node);
        break;
      default:
        return res.status(400).json({
          error: `Traversal type ${type} not implemented`,
        });
    }

    res.json({
      type,
      steps,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error executing ${type} traversal:`, error);
    res.status(500).json({
      error: 'Traversal execution failed',
      message: error.message,
    });
  }
});

app.post('/api/visualize/recursion/n-queens', (req, res) => {
  const { nsize, code } = req.body;

  console.log('Received N-Queens request:', { nsize, code });

  try {
    const result = runNQueenSteps(nsize, code);

    console.log(
      `N-Queens solved: ${result.steps.length} steps, ${result.solutionCount} solutions`
    );

    res.json({
      steps: result.steps,
      solutionCount: result.solutionCount,
    });
  } catch (error) {
    console.error('N-Queens execution error:', error);
    res.status(500).json({
      error: 'N-Queens execution failed',
      message: error.message,
    });
  }
});

app.post('/api/visualize/dp/grid-paths', (req, res) => {
  const { gridmatrix, code } = req.body;

  console.log('Received Grid Paths request:', {
    gridSize: gridmatrix
      ? `${gridmatrix.length}x${gridmatrix[0]?.length}`
      : 'invalid',
    code,
  });

  try {
    if (!gridmatrix || gridmatrix.length === 0) {
      throw new Error('Invalid grid matrix provided');
    }

    const result = runGridPaths2Steps(gridmatrix, code);

    console.log(
      `Grid Paths solved: ${result.steps.length} steps, ${result.totalPaths} total paths`
    );

    res.json({
      steps: result.steps,
      totalPaths: result.totalPaths,
    });
  } catch (error) {
    console.error('Grid Paths execution error:', error);
    res.status(500).json({
      error: 'Grid Paths execution failed',
      message: error.message,
    });
  }
});

// Comprehensive algorithm execution endpoint
app.post('/api/algorithms/:category/:algorithm', (req, res) => {
  const { category, algorithm } = req.params;
  const { input, target, options = {} } = req.body;

  try {
    let result;

    switch (category.toLowerCase()) {
      case 'sorting':
        switch (algorithm.toLowerCase()) {
          case 'bubble-sort':
            result = runBubbleSort('', input);
            break;
          default:
            return res.status(400).json({
              error: `Sorting algorithm ${algorithm} not implemented`,
            });
        }
        break;

      case 'searching': // Add searching algorithms here
        return res.status(400).json({
          error: `Searching algorithms not yet implemented`,
        });

      case 'graph': // Add graph algorithms here
        return res.status(400).json({
          error: `Graph algorithms not yet implemented`,
        });

      case 'recursion':
        switch (algorithm.toLowerCase()) {
          case 'n-queens':
            result = runNQueenSteps(options.nsize || 4, '');
            break;
          default:
            return res.status(400).json({
              error: `Recursion algorithm ${algorithm} not implemented`,
            });
        }
        break;

      case 'dp':
        switch (algorithm.toLowerCase()) {
          case 'grid-paths':
            result = runGridPaths2Steps(input, '');
            break;
          default:
            return res.status(400).json({
              error: `DP algorithm ${algorithm} not implemented`,
            });
        }
        break;

      default:
        return res.status(400).json({
          error: `Category ${category} not supported`,
        });
    }

    res.json({
      category,
      algorithm,
      result,
      inputSize: input ? (Array.isArray(input) ? input.length : 1) : 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(`Error executing ${category}/${algorithm}:`, error);
    res.status(500).json({
      error: 'Algorithm execution failed',
      message: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Get available algorithms endpoint
app.get('/api/algorithms', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;

    let query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const algorithms = await Algorithm.find(query)
      .select('name category description complexity difficulty tags stats')
      .sort({ 'stats.totalRuns': -1 });

    res.json({
      algorithms,
      total: algorithms.length,
      filters: { category, difficulty, search },
    });
  } catch (error) {
    console.error('Get algorithms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific algorithm
app.get('/api/algorithms/:id', async (req, res) => {
  try {
    const algorithm = await Algorithm.findById(req.params.id);

    if (!algorithm) {
      return res.status(404).json({ message: 'Algorithm not found' });
    } // Increment view count

    algorithm.stats.views += 1;
    await algorithm.save();

    res.json({ algorithm });
  } catch (error) {
    console.error('Get algorithm error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get algorithm code by category and name
app.get('/api/algorithms/:category/:algorithm', async (req, res) => {
  const { category, algorithm } = req.params;

  try {
    const normalizedCategory = category.toLowerCase();
    const normalizedAlgorithm = algorithm.toLowerCase().replace(/\s+/g, '-'); // Try to find in database first

    let algorithmCode = await AlgorithmCode.findOne({
      category: normalizedCategory,
      name: normalizedAlgorithm,
      isActive: true,
    });

    if (algorithmCode) {
      return res.json({
        code: algorithmCode.code,
        category: algorithmCode.category,
        algorithm: algorithmCode.name,
        language: algorithmCode.language,
        description: algorithmCode.description,
        complexity: algorithmCode.complexity,
      });
    } // Fallback to hardcoded templates if not in database

    const fallbackCode = getFallbackAlgorithmCode(
      normalizedCategory,
      normalizedAlgorithm
    );

    if (fallbackCode) {
      res.json({
        code: fallbackCode,
        category: normalizedCategory,
        algorithm: normalizedAlgorithm,
        language: 'javascript',
      });
    } else {
      res.status(404).json({
        message: `Algorithm ${algorithm} not found in category ${category}`,
      });
    }
  } catch (error) {
    console.error('Get algorithm code error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save algorithm code to database
app.post(
  '/api/algorithms/:category/:algorithm',
  authenticateToken,
  async (req, res) => {
    const { category, algorithm } = req.params;
    const {
      code,
      language = 'javascript',
      description = '',
      complexity = {},
    } = req.body;

    try {
      const normalizedCategory = category.toLowerCase();
      const normalizedAlgorithm = algorithm.toLowerCase().replace(/\s+/g, '-');

      const algorithmCode = await AlgorithmCode.findOneAndUpdate(
        { category: normalizedCategory, name: normalizedAlgorithm },
        {
          name: normalizedAlgorithm,
          category: normalizedCategory,
          code,
          language,
          description,
          complexity,
          createdBy: req.user.userId,
          lastUpdated: new Date(),
        },
        { upsert: true, new: true }
      );

      res.json({
        message: 'Algorithm code saved successfully',
        algorithmCode: {
          id: algorithmCode._id,
          name: algorithmCode.name,
          category: algorithmCode.category,
          language: algorithmCode.language,
        },
      });
    } catch (error) {
      console.error('Save algorithm code error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Helper function for fallback algorithm codes
const getFallbackAlgorithmCode = (category, algorithm) => {
  const algorithmCode = {
    sorting: {
      'bubble-sort': `function bubbleSort(arr) {
  const n = arr.length;
  let swapped;
  
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    
    // If no swaps occurred, array is sorted
    if (!swapped) break;
  }
  
  return arr;
}`,
      'selection-sort': `function selectionSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    
    // Find minimum element in remaining array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    
    // Swap if minimum is not at current position
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  
  return arr;
}`,
      'insertion-sort': `function insertionSort(arr) {
  const n = arr.length;
  
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    
    // Move elements greater than key one position ahead
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    
    arr[j + 1] = key;
  }
  
  return arr;
}`,
      'merge-sort': `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
      'quick-sort': `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
      'heap-sort': `function heapSort(arr) {
  const n = arr.length;
  
  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }
  
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }
  
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,
      'radix-sort': `function radixSort(arr) {
  const max = Math.max(...arr);
  
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(arr, exp);
  }
  
  return arr;
}

function countingSortByDigit(arr, exp) {
  const n = arr.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);
  
  // Count occurrences
  for (let i = 0; i < n; i++) {
    count[Math.floor(arr[i] / exp) % 10]++;
  }
  
  // Change count[i] to position of next occurrence
  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }
  
  // Build output array
  for (let i = n - 1; i >= 0; i--) {
    output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
    count[Math.floor(arr[i] / exp) % 10]--;
  }
  
  // Copy output back to original array
  for (let i = 0; i < n; i++) {
    arr[i] = output[i];
  }
}`,
    },
    searching: {
      'linear-search': `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // Found at index i
    }
  }
  return -1; // Not found
}`,
      'binary-search': `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1; // Target not found
}`,
    },
    graph: {
      bfs: `function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  visited.add(startNode);
  
  while (queue.length > 0) {
    const currentNode = queue.shift();
    result.push(currentNode);
    
    const neighbors = graph[currentNode] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`,
      dfs: `function dfs(graph, startNode) {
  const visited = new Set();
  const result = [];
  
  const dfsHelper = (node) => {
    visited.add(node);
    result.push(node);
    
    const neighbors = graph[node] || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  };
  
  dfsHelper(startNode);
  return result;
}`,
      dijkstra: `function dijkstra(graph, start, end) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // Initialize distances
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let current = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        current = node;
      }
    }
    
    if (current === null || current === end) break;
    unvisited.delete(current);
    
    // Update distances to neighbors
    for (const neighbor in graph[current]) {
      const distance = distances[current] + graph[current][neighbor];
      if (distance < distances[neighbor]) {
        distances[neighbor] = distance;
        previous[neighbor] = current;
      }
    }
  }
  
  return { distances, previous };
}`,
    },
    recursion: {
      factorial: `function factorial(n) {
  if (n <= 1) {
    return 1; // Base case
  }
  
  return n * factorial(n - 1); // Recursive case
}`,
      fibonacci: `function fibonacci(n) {
  if (n <= 1) {
    return n; // Base case
  }
  
  return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
}`,
      'n-queens': `function solveNQueens(n) {
  const board = Array(n).fill().map(() => Array(n).fill('.'));
  const result = [];
  
  const isValid = (row, col) => {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // Check diagonals
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  };
  
  const backtrack = (row) => {
    if (row === n) {
      result.push(board.map(row => row.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isValid(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';
      }
    }
  };
  
  backtrack(0);
  return result;
}`,
      'tower-of-hanoi': `function towerOfHanoi(n, source, destination, auxiliary) {
  if (n === 1) {
    console.log(\`Move disk 1 from \${source} to \${destination}\`);
    return;
  }
  
  towerOfHanoi(n - 1, source, auxiliary, destination);
  console.log(\`Move disk \${n} from \${source} to \${destination}\`);
  towerOfHanoi(n - 1, auxiliary, destination, source);
}`,
    },
    dp: {
      '0-1-knapsack': `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill().map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}`,
      lcs: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}`,
      'grid-paths': `function uniquePaths(m, n) {
  const dp = Array(m).fill().map(() => Array(n).fill(1));
  
  for (let i = 1; i < m; i++) {
    for (let j = 1; j < n; j++) {
      dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
    }
  }
  
  return dp[m - 1][n - 1];
}`,
      'coin-change': `function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    },
  };

  return algorithmCode[category]?.[algorithm] || null;
};

// Get user progress
app.get('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user.userId })
      .populate('algorithmId', 'name category difficulty')
      .sort({ updatedAt: -1 });

    const overallProgress = await UserProgress.getUserOverallProgress(
      req.user.userId
    );

    res.json({
      progress,
      overall: overallProgress[0] || {
        totalAlgorithms: 0,
        completedAlgorithms: 0,
        masteredAlgorithms: 0,
        totalAttempts: 0,
        totalCompletions: 0,
        totalTimeSpent: 0,
        favoriteAlgorithms: 0,
      },
    });
  } catch (error) {
    console.error('Get user progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user progress
app.post('/api/user/progress', authenticateToken, async (req, res) => {
  try {
    const {
      algorithmId,
      algorithmName,
      category,
      status,
      executionTime,
      isCompletion,
    } = req.body;

    let progress = await UserProgress.findOne({
      userId: req.user.userId,
      algorithmId: algorithmId,
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user.userId,
        algorithmId: algorithmId,
        algorithmName: algorithmName,
        category: category,
      });
    }

    if (isCompletion) {
      await progress.recordCompletion(executionTime);
    } else {
      await progress.recordAttempt(executionTime);
    } // Update user statistics

    const user = await User.findById(req.user.userId);
    if (user) {
      user.statistics.totalTimeSpent += executionTime || 0;
      if (isCompletion) {
        user.statistics.algorithmsCompleted += 1;
      }
      await user.save();
    }

    res.json({
      message: 'Progress updated successfully',
      progress,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user achievements
app.get('/api/user/achievements', authenticateToken, async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true }).sort({
      points: -1,
    });

    const userProgress = await UserProgress.find({ userId: req.user.userId }); // Check which achievements user has earned

    const earnedAchievements = [];
    for (const achievement of achievements) {
      const hasEarned = await achievement.checkCriteria(
        req.user.userId,
        userProgress
      );
      if (hasEarned) {
        earnedAchievements.push(achievement);
      }
    }

    res.json({
      allAchievements: achievements,
      earnedAchievements,
      totalEarned: earnedAchievements.length,
      totalAvailable: achievements.length,
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const { category, timeframe } = req.query;

    let matchQuery = {};
    if (category) {
      matchQuery.category = category;
    } // Add timeframe filter if needed

    if (timeframe === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchQuery.updatedAt = { $gte: weekAgo };
    } else if (timeframe === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchQuery.updatedAt = { $gte: monthAgo };
    }

    const leaderboard = await UserProgress.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$userId',
          totalCompletions: { $sum: '$completions' },
          totalTimeSpent: { $sum: '$totalTimeSpent' },
          algorithmsCompleted: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          profile: '$user.profile',
          totalCompletions: 1,
          totalTimeSpent: 1,
          algorithmsCompleted: 1,
          score: {
            $add: [
              '$totalCompletions',
              { $multiply: ['$algorithmsCompleted', 2] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 50 },
    ]);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

import express from 'express';
import cors from 'cors';
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

// Import algorithm execution logic
import runBubbleSort from './sorts/bubbleSort/index.js';

import runInorderTrav from './binaryTree/traversals/inorderIndex.js';
import runNQueenSteps from './recursions/NQueen/NQueen.index.js';
import runGridPaths2Steps from './dynamicProgramming/GridPaths2/gridPaths2.index.js';

// Load environment variables
dotenv.config();

// const url = '/api/visualize/sorts/bubble-sort';

// import {url} from '../hooks/useAlgFetch.js'

// const express = require('express');
// const cors = require('cors');
// const runBubbleSort = require('./sorts/bubbleSort/index.js');

const app = express();
const port = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/algovisualizer';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';

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
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
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
  const { username, email, password, firstName, lastName } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
        field: existingUser.email === email ? 'email' : 'username',
      });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      profile: { firstName, lastName },
    });

    await newUser.save();

    // Generate JWT token
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
    console.error('Registration error:', error);

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
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
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
    }
    // Return the full saved object, including the 'steps' array
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

      case 'searching':
        // Add searching algorithms here
        return res.status(400).json({
          error: `Searching algorithms not yet implemented`,
        });

      case 'graph':
        // Add graph algorithms here
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
    }

    // Increment view count
    algorithm.stats.views += 1;
    await algorithm.save();

    res.json({ algorithm });
  } catch (error) {
    console.error('Get algorithm error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

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
    }

    // Update user statistics
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

    const userProgress = await UserProgress.find({ userId: req.user.userId });

    // Check which achievements user has earned
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
    }

    // Add timeframe filter if needed
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

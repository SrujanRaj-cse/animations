import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Algorithm from '../models/Algorithm.js';
import Achievement from '../models/Achievement.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/algovisualizer';

const algorithms = [
    {
        name: 'Bubble Sort',
        category: 'sorting',
        description: 'A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
        complexity: {
            time: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)' },
            space: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }
        },
        implementation: {
            javascript: `function bubbleSort(arr) {
    const n = arr.length;
    let swapped;
    
    for (let i = 0; i < n - 1; i++) {
        swapped = false;
        
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
            }
        }
        
        if (!swapped) break;
    }
    
    return arr;
}`,
            python: `def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n - 1):
        swapped = False
        
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        
        if not swapped:
            break
    
    return arr`
        },
        visualization: {
            type: 'array',
            defaultData: [64, 34, 25, 12, 22, 11, 90],
            parameters: [
                { name: 'array', type: 'array', required: true, description: 'Array to be sorted' }
            ]
        },
        difficulty: 'beginner',
        tags: ['sorting', 'comparison', 'stable', 'in-place'],
        examples: [
            {
                input: [64, 34, 25, 12, 22, 11, 90],
                output: [11, 12, 22, 25, 34, 64, 90],
                explanation: 'Elements are compared and swapped until the array is sorted'
            }
        ]
    },
    {
        name: 'Quick Sort',
        category: 'sorting',
        description: 'An efficient sorting algorithm that uses divide and conquer strategy by selecting a pivot element and partitioning the array.',
        complexity: {
            time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)' },
            space: { best: 'O(log n)', average: 'O(log n)', worst: 'O(n)' }
        },
        difficulty: 'intermediate',
        tags: ['sorting', 'divide-and-conquer', 'unstable', 'in-place']
    },
    {
        name: 'Binary Search',
        category: 'searching',
        description: 'An efficient search algorithm that finds the position of a target value within a sorted array by repeatedly dividing the search interval in half.',
        complexity: {
            time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
            space: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' }
        },
        difficulty: 'beginner',
        tags: ['searching', 'divide-and-conquer', 'sorted-array']
    },
    {
        name: 'BFS',
        category: 'graph',
        description: 'Breadth-First Search is a graph traversal algorithm that explores all vertices at the present depth level before moving on to vertices at the next depth level.',
        complexity: {
            time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
            space: { best: 'O(V)', average: 'O(V)', worst: 'O(V)' }
        },
        difficulty: 'intermediate',
        tags: ['graph', 'traversal', 'queue', 'shortest-path']
    },
    {
        name: 'Fibonacci',
        category: 'recursion',
        description: 'A sequence where each number is the sum of the two preceding ones, often used to demonstrate recursion and dynamic programming concepts.',
        complexity: {
            time: { best: 'O(1)', average: 'O(φⁿ)', worst: 'O(φⁿ)' },
            space: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' }
        },
        difficulty: 'beginner',
        tags: ['recursion', 'sequence', 'mathematical', 'memoization']
    },
    {
        name: '0/1 Knapsack',
        category: 'dp',
        description: 'A classic dynamic programming problem where items with given weights and values must be packed into a knapsack of limited capacity.',
        complexity: {
            time: { best: 'O(nW)', average: 'O(nW)', worst: 'O(nW)' },
            space: { best: 'O(W)', average: 'O(nW)', worst: 'O(nW)' }
        },
        difficulty: 'advanced',
        tags: ['dynamic-programming', 'optimization', 'knapsack', 'decision-problem']
    }
];

const achievements = [
    {
        name: 'First Steps',
        description: 'Complete your first algorithm visualization',
        icon: '👶',
        category: 'completion',
        criteria: { type: 'algorithm_count', value: 1 },
        points: 10,
        rarity: 'common'
    },
    {
        name: 'Sorting Master',
        description: 'Complete all sorting algorithms',
        icon: '🔄',
        category: 'category_completion',
        criteria: { type: 'category_completion', value: 5, category: 'sorting' },
        points: 50,
        rarity: 'uncommon'
    },
    {
        name: 'Speed Demon',
        description: 'Complete an algorithm in under 1 second',
        icon: '⚡',
        category: 'speed',
        criteria: { type: 'speed_threshold', value: 1000 },
        points: 25,
        rarity: 'rare'
    },
    {
        name: 'Persistent Learner',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        criteria: { type: 'streak_count', value: 7 },
        points: 100,
        rarity: 'epic'
    },
    {
        name: 'Algorithm Explorer',
        description: 'Complete 20 different algorithms',
        icon: '🗺️',
        category: 'exploration',
        criteria: { type: 'algorithm_count', value: 20 },
        points: 200,
        rarity: 'legendary'
    }
];

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Algorithm.deleteMany({});
        await Achievement.deleteMany({});
        console.log('🧹 Cleared existing data');

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@algovisualizer.com',
            password: 'admin123',
            role: 'admin',
            profile: {
                firstName: 'Admin',
                lastName: 'User',
                level: 'advanced'
            },
            emailVerified: true
        });
        await adminUser.save();
        console.log('👤 Created admin user');

        // Create sample user
        const sampleUser = new User({
            username: 'demo',
            email: 'demo@algovisualizer.com',
            password: 'demo123',
            profile: {
                firstName: 'Demo',
                lastName: 'User',
                level: 'beginner'
            },
            emailVerified: true
        });
        await sampleUser.save();
        console.log('👤 Created demo user');

        // Seed algorithms
        for (const algoData of algorithms) {
            const algorithm = new Algorithm(algoData);
            await algorithm.save();
        }
        console.log(`📚 Seeded ${algorithms.length} algorithms`);

        // Seed achievements
        for (const achievementData of achievements) {
            const achievement = new Achievement(achievementData);
            await achievement.save();
        }
        console.log(`🏆 Seeded ${achievements.length} achievements`);

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Sample accounts created:');
        console.log('Admin: admin@algovisualizer.com / admin123');
        console.log('Demo: demo@algovisualizer.com / demo123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

seedDatabase();

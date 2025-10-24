import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Algorithm from '../models/Algorithm.js';
import Achievement from '../models/Achievement.js';
import VisualizationStep from '../models/VisualizationStep.js';
import UserProgress from '../models/UserProgress.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/algovisualizer';

const resetDatabase = async () => {
    try {
        console.log('🗑️ Starting database reset...');
        
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Drop all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        for (const collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name);
            console.log(`🗑️ Dropped collection: ${collection.name}`);
        }

        console.log('🎉 Database reset completed successfully!');
        console.log('💡 Run "npm run seed" to populate with sample data');

    } catch (error) {
        console.error('❌ Error resetting database:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected from MongoDB');
        process.exit(0);
    }
};

resetDatabase();

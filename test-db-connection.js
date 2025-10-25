// Test MongoDB connection and database seeding
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/algovisualizer';

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Test database operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(
      '📋 Available collections:',
      collections.map(c => c.name)
    );

    // Check if AlgorithmCode collection exists and has data
    const algorithmCodes = await db
      .collection('algorithmcodes')
      .countDocuments();
    console.log(`📊 AlgorithmCode collection has ${algorithmCodes} documents`);

    if (algorithmCodes > 0) {
      console.log('✅ Database is seeded with algorithm codes!');
    } else {
      console.log('⚠️  Database is empty - need to run seeding script');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

testConnection();

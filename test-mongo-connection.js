// Test MongoDB connection for Compass
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://localhost:27017/algovisualizer';

const testConnection = async () => {
  try {
    console.log('🔌 Testing MongoDB connection for Compass...');
    console.log('Connection URI:', MONGO_URI);

    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');

    // Get database info
    const db = mongoose.connection.db;
    const admin = db.admin();
    const serverStatus = await admin.serverStatus();

    console.log('📊 MongoDB Server Info:');
    console.log('- Version:', serverStatus.version);
    console.log('- Uptime:', Math.floor(serverStatus.uptime / 60), 'minutes');
    console.log('- Host:', serverStatus.host);
    console.log('- Port:', serverStatus.port);

    // List databases
    const databases = await admin.listDatabases();
    console.log('📋 Available databases:');
    databases.databases.forEach(db => {
      console.log(
        `  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`
      );
    });

    // List collections in our database
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections in algovisualizer database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    console.log('\n🎯 For MongoDB Compass, use this connection string:');
    console.log('mongodb://localhost:27017');
    console.log('or');
    console.log('mongodb://127.0.0.1:27017');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

testConnection();

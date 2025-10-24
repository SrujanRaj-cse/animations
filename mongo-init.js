// MongoDB initialization script
db = db.getSiblingDB('algovisualizer');

// Create collections
db.createCollection('users');
db.createCollection('visualizations');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "username": 1 }, { unique: true });
db.visualizations.createIndex({ "userId": 1 });
db.visualizations.createIndex({ "algorithmName": 1 });

// Insert sample data (optional)
db.users.insertOne({
  username: "admin",
  email: "admin@algovisualizer.com",
  password: "admin123",
  role: "admin",
  createdAt: new Date()
});

print("Database initialized successfully!");

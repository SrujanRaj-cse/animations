import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true, // <-- Index created here
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true, // <-- Index created here
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    avatar: { type: String },
    bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    language: { type: String, default: 'javascript' },
    animationSpeed: { type: Number, default: 300, min: 50, max: 1000 },
  },
  statistics: {
    algorithmsCompleted: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    favoriteAlgorithms: [{ type: String }],
    achievements: [{ type: String }],
  },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt field before saving
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get user's full name
UserSchema.virtual('fullName').get(function () {
  return (
    `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim() ||
    this.username
  );
});

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Indexes for better performance - ONLY KEEP NON-REDUNDANT INDEXES
UserSchema.index({ createdAt: -1 });

const User = mongoose.model('User', UserSchema);

export default User;

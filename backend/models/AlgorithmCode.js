import mongoose from 'mongoose';

const algorithmCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['sorting', 'searching', 'graph', 'recursion', 'dp'],
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      default: 'javascript',
      enum: ['javascript', 'python', 'java', 'cpp'],
    },
    description: {
      type: String,
      default: '',
    },
    complexity: {
      time: String,
      space: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
algorithmCodeSchema.index({ category: 1, name: 1 });
algorithmCodeSchema.index({ isActive: 1 });

export default mongoose.model('AlgorithmCode', algorithmCodeSchema);

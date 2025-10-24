
import mongoose from 'mongoose';

const VisualizationStepSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
    },
    algorithmName: { 
        type: String, 
        required: [true, 'Algorithm name is required'],
        trim: true,
        index: true
    },
    algorithmCategory: {
        type: String,
        enum: ['sorting', 'searching', 'graph', 'recursion', 'dp'],
        required: true,
        index: true
    },
    steps: { 
        type: [mongoose.Schema.Types.Mixed], 
        required: [true, 'Steps are required'],
        validate: {
            validator: function(steps) {
                return Array.isArray(steps) && steps.length > 0;
            },
            message: 'Steps must be a non-empty array'
        }
    },
    inputData: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    result: {
        type: mongoose.Schema.Types.Mixed
    },
    executionTime: {
        type: Number, // in milliseconds
        min: 0
    },
    complexity: {
        time: { type: String }, // e.g., "O(n log n)"
        space: { type: String } // e.g., "O(1)"
    },
    parameters: {
        nSize: { type: Number }, // For N-Queens, factorial, etc.
        target: { type: Number }, // For search algorithms
        capacity: { type: Number }, // For knapsack
        gridSize: { type: String }, // For grid problems
        customParams: { type: mongoose.Schema.Types.Mixed }
    },
    metadata: {
        arraySize: { type: Number },
        graphNodes: { type: Number },
        graphEdges: { type: Number },
        customInput: { type: Boolean, default: false }
    },
    status: {
        type: String,
        enum: ['completed', 'paused', 'failed', 'in_progress'],
        default: 'completed'
    },
    isPublic: { type: Boolean, default: false },
    tags: [{ type: String, trim: true }],
    description: { 
        type: String, 
        maxlength: [500, 'Description cannot exceed 500 characters'],
        trim: true
    },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    views: { type: Number, default: 0 },
    createdAt: { 
        type: Date, 
        default: Date.now,
        index: true
    },
    updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt field before saving
VisualizationStepSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual for like count
VisualizationStepSchema.virtual('likeCount').get(function() {
    return this.likes ? this.likes.length : 0;
});

// Method to add a like
VisualizationStepSchema.methods.addLike = function(userId) {
    if (!this.likes.includes(userId)) {
        this.likes.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove a like
VisualizationStepSchema.methods.removeLike = function(userId) {
    this.likes = this.likes.filter(id => !id.equals(userId));
    return this.save();
};

// Method to increment views
VisualizationStepSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Indexes for better performance
VisualizationStepSchema.index({ userId: 1, createdAt: -1 });
VisualizationStepSchema.index({ algorithmName: 1, createdAt: -1 });
VisualizationStepSchema.index({ algorithmCategory: 1 });
VisualizationStepSchema.index({ isPublic: 1, createdAt: -1 });
VisualizationStepSchema.index({ 'likes': 1 });

const VisualizationStep = mongoose.model('VisualizationStep', VisualizationStepSchema);

export default VisualizationStep;
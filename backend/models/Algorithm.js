import mongoose from 'mongoose';

const AlgorithmSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Algorithm name is required'],
        unique: true,
        trim: true,
        index: true
    },
    category: {
        type: String,
        enum: ['sorting', 'searching', 'graph', 'recursion', 'dp'],
        required: [true, 'Algorithm category is required'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Algorithm description is required'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    complexity: {
        time: {
            best: { type: String }, // e.g., "O(n log n)"
            average: { type: String },
            worst: { type: String }
        },
        space: {
            best: { type: String },
            average: { type: String },
            worst: { type: String }
        }
    },
    implementation: {
        javascript: { type: String },
        python: { type: String },
        java: { type: String },
        cpp: { type: String }
    },
    visualization: {
        type: {
            type: String,
            enum: ['array', 'graph', 'tree', 'matrix', 'custom'],
            default: 'array'
        },
        defaultData: mongoose.Schema.Types.Mixed,
        parameters: [{
            name: { type: String, required: true },
            type: { type: String, enum: ['number', 'array', 'string', 'boolean'], required: true },
            required: { type: Boolean, default: false },
            min: Number,
            max: Number,
            description: String
        }]
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
        index: true
    },
    tags: [{ 
        type: String, 
        trim: true,
        lowercase: true
    }],
    examples: [{
        input: mongoose.Schema.Types.Mixed,
        output: mongoose.Schema.Types.Mixed,
        explanation: String
    }],
    relatedAlgorithms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Algorithm' 
    }],
    isActive: { type: Boolean, default: true },
    isBuiltIn: { type: Boolean, default: true },
    submittedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    stats: {
        totalRuns: { type: Number, default: 0 },
        averageExecutionTime: { type: Number, default: 0 },
        successRate: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        views: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt field before saving
AlgorithmSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Indexes for better performance
AlgorithmSchema.index({ name: 1 });
AlgorithmSchema.index({ category: 1, difficulty: 1 });
AlgorithmSchema.index({ tags: 1 });
AlgorithmSchema.index({ isActive: 1 });
AlgorithmSchema.index({ 'stats.totalRuns': -1 });

const Algorithm = mongoose.model('Algorithm', AlgorithmSchema);

export default Algorithm;

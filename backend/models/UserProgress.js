import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    algorithmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Algorithm',
        required: true,
        index: true
    },
    algorithmName: {
        type: String,
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: ['sorting', 'searching', 'graph', 'recursion', 'dp'],
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'mastered'],
        default: 'not_started',
        index: true
    },
    attempts: {
        type: Number,
        default: 0,
        min: 0
    },
    completions: {
        type: Number,
        default: 0,
        min: 0
    },
    bestTime: {
        type: Number, // in milliseconds
        min: 0
    },
    averageTime: {
        type: Number, // in milliseconds
        min: 0
    },
    totalTimeSpent: {
        type: Number, // in milliseconds
        default: 0,
        min: 0
    },
    lastAttempt: {
        type: Date
    },
    firstCompletion: {
        type: Date
    },
    lastCompletion: {
        type: Date
    },
    streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 }
    },
    achievements: [{
        name: { type: String, required: true },
        description: String,
        earnedAt: { type: Date, default: Date.now },
        points: { type: Number, default: 0 }
    }],
    notes: {
        type: String,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    },
    isFavorite: {
        type: Boolean,
        default: false,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Compound index for unique user-algorithm combination
UserProgressSchema.index({ userId: 1, algorithmId: 1 }, { unique: true });

// Update updatedAt field before saving
UserProgressSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Method to record an attempt
UserProgressSchema.methods.recordAttempt = function(executionTime) {
    this.attempts += 1;
    this.lastAttempt = new Date();
    this.totalTimeSpent += executionTime || 0;
    
    // Update best time
    if (!this.bestTime || executionTime < this.bestTime) {
        this.bestTime = executionTime;
    }
    
    // Update average time
    if (this.completions > 0) {
        this.averageTime = this.totalTimeSpent / this.completions;
    }
    
    return this.save();
};

// Method to record a completion
UserProgressSchema.methods.recordCompletion = function(executionTime) {
    this.completions += 1;
    this.lastCompletion = new Date();
    
    if (!this.firstCompletion) {
        this.firstCompletion = new Date();
        this.status = 'completed';
    }
    
    // Update streak
    this.streak.current += 1;
    if (this.streak.current > this.streak.longest) {
        this.streak.longest = this.streak.current;
    }
    
    return this.recordAttempt(executionTime);
};

// Method to reset streak
UserProgressSchema.methods.resetStreak = function() {
    this.streak.current = 0;
    return this.save();
};

// Method to add achievement
UserProgressSchema.methods.addAchievement = function(achievement) {
    const existingAchievement = this.achievements.find(
        a => a.name === achievement.name
    );
    
    if (!existingAchievement) {
        this.achievements.push(achievement);
        return this.save();
    }
    
    return Promise.resolve(this);
};

// Static method to get user's overall progress
UserProgressSchema.statics.getUserOverallProgress = function(userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId) } },
        {
            $group: {
                _id: null,
                totalAlgorithms: { $sum: 1 },
                completedAlgorithms: {
                    $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                },
                masteredAlgorithms: {
                    $sum: { $cond: [{ $eq: ['$status', 'mastered'] }, 1, 0] }
                },
                totalAttempts: { $sum: '$attempts' },
                totalCompletions: { $sum: '$completions' },
                totalTimeSpent: { $sum: '$totalTimeSpent' },
                favoriteAlgorithms: {
                    $sum: { $cond: ['$isFavorite', 1, 0] }
                }
            }
        }
    ]);
};

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);

export default UserProgress;

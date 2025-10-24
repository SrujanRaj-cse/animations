import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Achievement name is required'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Achievement description is required'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    icon: {
        type: String,
        default: '🏆'
    },
    category: {
        type: String,
        enum: ['completion', 'speed', 'streak', 'exploration', 'mastery', 'social', 'category_completion'],
        required: true,
        index: true
    },
    criteria: {
        type: {
            type: String,
            enum: ['algorithm_count', 'category_completion', 'speed_threshold', 'streak_count', 'time_spent', 'custom'],
            required: true
        },
        value: {
            type: Number,
            required: function() {
                return this.criteria.type !== 'custom';
            }
        },
        algorithm: String, // For algorithm-specific achievements
        category: String,   // For category-specific achievements
        customCondition: String // For custom achievements
    },
    points: {
        type: Number,
        required: true,
        min: 1,
        max: 1000
    },
    rarity: {
        type: String,
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
        default: 'common',
        index: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
    }],
    stats: {
        totalEarned: { type: Number, default: 0 },
        lastEarned: { type: Date }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update updatedAt field before saving
AchievementSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Method to check if user meets criteria
AchievementSchema.methods.checkCriteria = async function(userId, userProgress) {
    const UserProgress = mongoose.model('UserProgress');
    
    switch (this.criteria.type) {
        case 'algorithm_count':
            const completedCount = await UserProgress.countDocuments({
                userId,
                status: 'completed'
            });
            return completedCount >= this.criteria.value;
            
        case 'category_completion':
            const categoryCount = await UserProgress.countDocuments({
                userId,
                category: this.criteria.category,
                status: 'completed'
            });
            return categoryCount >= this.criteria.value;
            
        case 'speed_threshold':
            const algorithmProgress = await UserProgress.findOne({
                userId,
                algorithmName: this.criteria.algorithm
            });
            return algorithmProgress && algorithmProgress.bestTime <= this.criteria.value;
            
        case 'streak_count':
            const maxStreak = await UserProgress.aggregate([
                { $match: { userId: mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, maxStreak: { $max: '$streak.longest' } } }
            ]);
            return maxStreak.length > 0 && maxStreak[0].maxStreak >= this.criteria.value;
            
        case 'time_spent':
            const totalTime = await UserProgress.aggregate([
                { $match: { userId: mongoose.Types.ObjectId(userId) } },
                { $group: { _id: null, totalTime: { $sum: '$totalTimeSpent' } } }
            ]);
            return totalTime.length > 0 && totalTime[0].totalTime >= this.criteria.value;
            
        default:
            return false;
    }
};

// Method to award achievement
AchievementSchema.methods.award = async function(userId) {
    const UserProgress = mongoose.model('UserProgress');
    
    // Update achievement stats
    this.stats.totalEarned += 1;
    this.stats.lastEarned = new Date();
    await this.save();
    
    // Add to user's progress
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
        await userProgress.addAchievement({
            name: this.name,
            description: this.description,
            points: this.points
        });
    }
    
    return this;
};

// Indexes for better performance
AchievementSchema.index({ category: 1, rarity: 1 });
AchievementSchema.index({ isActive: 1 });
AchievementSchema.index({ 'stats.totalEarned': -1 });

const Achievement = mongoose.model('Achievement', AchievementSchema);

export default Achievement;

const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        targetType: {
            type: String,
            required: true,
            enum: ['Post', 'Comment'],
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'targetType', // Dynamic reference based on targetType
        },
    },
    {
        timestamps: true,
    }
);

// Compound unique index to prevent duplicate likes
// Also speeds up queries for likes on a specific target
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
likeSchema.index({ targetType: 1, targetId: 1 });

module.exports = mongoose.model('Like', likeSchema);

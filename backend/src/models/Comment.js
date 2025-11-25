const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Comment content is required'],
            trim: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        parentComment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment',
            default: null, // null for top-level comments, ObjectId for replies
        },
    },
    {
        timestamps: true,
    }
);

// Virtual for replies count
commentSchema.virtual('repliesCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
    count: true,
});

// Indexes for efficient queries
commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ parentComment: 1, createdAt: 1 });

// Ensure virtuals are included in JSON
commentSchema.set('toJSON', { virtuals: true });
commentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', commentSchema);

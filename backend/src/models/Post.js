const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            trim: true,
        },
        image: {
            type: String, // Base64 encoded image data URI
            required: false,
        },
        imageContentType: {
            type: String, // MIME type (e.g., 'image/png', 'image/jpeg')
            required: false,
        },
        privacy: {
            type: String,
            enum: ['public', 'private'],
            default: 'public',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for efficient queries
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

// Virtual for comments count
postSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true,
});

// Validation: at least content or image must be provided
postSchema.pre('validate', function (next) {
    if (!this.content && !this.image) {
        this.invalidate('content', 'Either content or image must be provided');
    }
    next();
});

module.exports = mongoose.model('Post', postSchema);

const Like = require('../models/Like');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// @desc    Toggle like on a post or comment
// @route   POST /api/likes
// @access  Private
const toggleLike = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.body;

        // Validate targetType
        if (!['Post', 'Comment'].includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid target type. Must be Post or Comment',
            });
        }

        // Check if target exists
        const Model = targetType === 'Post' ? Post : Comment;
        const target = await Model.findById(targetId);

        if (!target) {
            return res.status(404).json({
                success: false,
                message: `${targetType} not found`,
            });
        }

        // If it's a comment, check post privacy
        if (targetType === 'Comment') {
            const post = await Post.findById(target.post);
            if (post.privacy === 'private' && post.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You cannot like comments on private posts',
                });
            }
        }

        // If it's a post, check privacy
        if (targetType === 'Post') {
            if (target.privacy === 'private' && target.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You cannot like private posts',
                });
            }
        }

        // Check if like already exists
        const existingLike = await Like.findOne({
            user: req.user._id,
            targetType,
            targetId,
        });

        if (existingLike) {
            // Unlike - remove the like
            await existingLike.deleteOne();
            return res.status(200).json({
                success: true,
                message: 'Like removed',
                liked: false,
            });
        } else {
            // Like - create new like
            const like = await Like.create({
                user: req.user._id,
                targetType,
                targetId,
            });

            return res.status(201).json({
                success: true,
                message: 'Liked successfully',
                liked: true,
                data: like,
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get all likes for a target (post or comment)
// @route   GET /api/likes/:targetType/:targetId
// @access  Private
const getLikes = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.params;

        // Validate targetType
        if (!['Post', 'Comment'].includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid target type. Must be Post or Comment',
            });
        }

        const likes = await Like.find({
            targetType,
            targetId,
        }).populate('user', 'firstName lastName email');

        res.status(200).json({
            success: true,
            count: likes.length,
            data: likes,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get users who liked a target
// @route   GET /api/likes/:targetType/:targetId/users
// @access  Private
const getLikeUsers = async (req, res, next) => {
    try {
        const { targetType, targetId } = req.params;

        // Validate targetType
        if (!['Post', 'Comment'].includes(targetType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid target type. Must be Post or Comment',
            });
        }

        const likes = await Like.find({
            targetType,
            targetId,
        }).populate('user', 'firstName lastName email');

        const users = likes.map(like => like.user);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    toggleLike,
    getLikes,
    getLikeUsers,
};

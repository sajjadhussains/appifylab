const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// @desc    Create a comment on a post
// @route   POST /api/posts/:postId/comments
// @access  Private
const createComment = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { content } = req.body;
        const { postId } = req.params;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check privacy - can only comment on public posts or own posts
        if (post.privacy === 'private' && post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You cannot comment on this private post',
            });
        }

        const comment = await Comment.create({
            content,
            post: postId,
            author: req.user._id,
            parentComment: null, // Top-level comment
        });

        await comment.populate('author', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a reply to a comment
// @route   POST /api/comments/:commentId/replies
// @access  Private
const createReply = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { content } = req.body;
        const { commentId } = req.params;

        // Check if parent comment exists
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Check if post exists and user has access
        const post = await Post.findById(parentComment.post);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        if (post.privacy === 'private' && post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You cannot reply to comments on this private post',
            });
        }

        const reply = await Comment.create({
            content,
            post: parentComment.post,
            author: req.user._id,
            parentComment: commentId,
        });

        await reply.populate('author', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: reply,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Private
const getComments = async (req, res, next) => {
    try {
        const { postId } = req.params;

        // Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check privacy
        if (post.privacy === 'private' && post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view comments on this post',
            });
        }

        // Get only top-level comments (parentComment is null)
        const comments = await Comment.find({
            post: postId,
            parentComment: null,
        })
            .populate('author', 'firstName lastName email')
            .populate('repliesCount')
            .sort({ createdAt: 1 }) // Oldest first
            .lean();

        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all replies for a comment
// @route   GET /api/comments/:commentId/replies
// @access  Private
const getReplies = async (req, res, next) => {
    try {
        const { commentId } = req.params;

        // Check if parent comment exists
        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Check post privacy
        const post = await Post.findById(parentComment.post);
        if (post.privacy === 'private' && post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view replies on this comment',
            });
        }

        const replies = await Comment.find({
            parentComment: commentId,
        })
            .populate('author', 'firstName lastName email')
            .sort({ createdAt: 1 }) // Oldest first
            .lean();

        res.status(200).json({
            success: true,
            count: replies.length,
            data: replies,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a comment or reply
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        // Check if user is the author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own comments',
            });
        }

        // Delete the comment and all its replies
        await Comment.deleteMany({
            $or: [
                { _id: req.params.id },
                { parentComment: req.params.id }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    createReply,
    getComments,
    getReplies,
    deleteComment,
};

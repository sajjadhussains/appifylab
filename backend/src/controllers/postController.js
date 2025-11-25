const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { content, privacy } = req.body;

        // Convert image buffer to Base64 data URI if file uploaded
        let imageData = null;
        let imageContentType = null;

        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            imageData = `data:${req.file.mimetype};base64,${base64Image}`;
            imageContentType = req.file.mimetype;
        }

        // Validate that at least content or image is provided
        if (!content && !imageData) {
            return res.status(400).json({
                success: false,
                message: 'Either content or image must be provided',
            });
        }

        const post = await Post.create({
            content,
            image: imageData,
            imageContentType: imageContentType,
            privacy: privacy || 'public',
            author: req.user._id,
        });

        // Populate author details
        await post.populate('author', 'firstName lastName email');

        res.status(201).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all posts (with privacy filtering)
// @route   GET /api/posts
// @access  Private
const getPosts = async (req, res, next) => {
    try {
        // Get public posts OR posts created by the current user
        const posts = await Post.find({
            $or: [
                { privacy: 'public' },
                { author: req.user._id }
            ]
        })
            .populate('author', 'firstName lastName email')
            .sort({ createdAt: -1 }) // Most recent first
            .lean();

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
const getPost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'firstName lastName email');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check privacy - only allow if public or user is the author
        if (post.privacy === 'private' && post.author._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view this post',
            });
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
const updatePost = async (req, res, next) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only update your own posts',
            });
        }

        const { content, privacy } = req.body;

        // Convert image buffer to Base64 data URI if new file uploaded
        let imageData = post.image;
        let imageContentType = post.imageContentType;

        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            imageData = `data:${req.file.mimetype};base64,${base64Image}`;
            imageContentType = req.file.mimetype;
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            { content, image: imageData, imageContentType: imageContentType, privacy },
            { new: true, runValidators: true }
        ).populate('author', 'firstName lastName email');

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        // Check if user is the author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own posts',
            });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
};

const express = require('express');
const {
    createPost,
    getPosts,
    getPost,
    updatePost,
    deletePost,
} = require('../controllers/postController');
const { createPostValidator, updatePostValidator } = require('../validators/postValidator');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// All routes are protected
router.use(protect);

// Post routes
router
    .route('/')
    .get(getPosts)
    .post(upload.single('image'), createPostValidator, createPost);

router
    .route('/:id')
    .get(getPost)
    .put(upload.single('image'), updatePostValidator, updatePost)
    .delete(deletePost);

module.exports = router;

const express = require('express');
const {
    createComment,
    createReply,
    getComments,
    getReplies,
    deleteComment,
} = require('../controllers/commentController');
const { createCommentValidator } = require('../validators/commentValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Comment routes
router
    .route('/posts/:postId/comments')
    .get(getComments)
    .post(createCommentValidator, createComment);

router
    .route('/comments/:commentId/replies')
    .get(getReplies)
    .post(createCommentValidator, createReply);

router
    .route('/comments/:id')
    .delete(deleteComment);

module.exports = router;

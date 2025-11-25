const express = require('express');
const {
    toggleLike,
    getLikes,
    getLikeUsers,
} = require('../controllers/likeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Like routes
router.post('/', toggleLike);
router.get('/:targetType/:targetId', getLikes);
router.get('/:targetType/:targetId/users', getLikeUsers);

module.exports = router;

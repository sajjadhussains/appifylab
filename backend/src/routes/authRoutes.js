const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { registerValidator, loginValidator } = require('../validators/authValidator');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/profile', protect, getProfile);

module.exports = router;

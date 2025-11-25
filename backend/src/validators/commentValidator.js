const { body } = require('express-validator');

const createCommentValidator = [
    body('content')
        .trim()
        .notEmpty()
        .withMessage('Comment content is required')
        .isLength({ min: 1, max: 1000 })
        .withMessage('Comment must be between 1 and 1000 characters'),
];

module.exports = {
    createCommentValidator,
};

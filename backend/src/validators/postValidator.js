const { body } = require('express-validator');

const createPostValidator = [
    body('content')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty if provided'),

    body('privacy')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('Privacy must be either public or private'),
];

const updatePostValidator = [
    body('content')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Content cannot be empty if provided'),

    body('privacy')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('Privacy must be either public or private'),
];

module.exports = {
    createPostValidator,
    updatePostValidator,
};

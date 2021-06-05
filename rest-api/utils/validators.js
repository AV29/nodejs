import { body } from 'express-validator';

const MIN_TITLE_LENGTH = 5;
const MIN_CONTENT_LENGTH = 5;

export const createPostValidators = [
    body('title')
        .trim()
        .isLength({ min: MIN_TITLE_LENGTH })
        .withMessage(`Title length should be minimum ${MIN_TITLE_LENGTH} characters`),
    body('content')
        .trim()
        .isLength({ min: MIN_CONTENT_LENGTH })
        .withMessage(`Content length should be minimum ${MIN_CONTENT_LENGTH} characters`)
];

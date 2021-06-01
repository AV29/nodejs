import { body } from 'express-validator';

export const createPostValidators = [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 })
];

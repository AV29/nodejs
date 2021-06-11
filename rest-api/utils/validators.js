import { body } from 'express-validator';
import User from '../models/user.js';
import { HttpError } from './errors.js';

const MIN_TITLE_LENGTH = 5;
const MIN_CONTENT_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 5;

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

export const signupValidators = [
    body('email')
        .isEmail()
        .withMessage(`Invalid email is entered`)
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) throw new HttpError(401, 'This email is already taken!');
            else return true;
        })
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: MIN_PASSWORD_LENGTH })
        .withMessage(`Password length should be minimum ${MIN_PASSWORD_LENGTH} characters`)
];

export const loginValidators = [
    body('email').isEmail().withMessage(`Invalid email is entered`),
    body('password')
        .trim()
        .isLength({ min: MIN_PASSWORD_LENGTH })
        .withMessage(`Password length should be minimum ${MIN_PASSWORD_LENGTH} characters`)
];

export const userStatusValidators = [body('status').trim().not().isEmpty().withMessage('Status cannot be empty')];

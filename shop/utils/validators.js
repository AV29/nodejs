import { body } from 'express-validator';
import User from '../models/user.js';
import { SignupError } from './errors.js';
import { MIN_PASSWORD_LENGTH } from './constants.js';

export const signupValidators = [
    body('email', 'Provided email is invalid')
        .isEmail()
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) throw new SignupError('This email is already taken!');
            else return true;
        })
        .normalizeEmail(),
    body('password', `Password length must be ${MIN_PASSWORD_LENGTH} characters min`)
        .isLength({ min: MIN_PASSWORD_LENGTH })
        .trim(),
    body('confirmPassword', 'Passwords have to match!')
        .custom((value, { req }) => value === req.body.password)
        .trim()
];

export const loginValidators = [
    body('email', 'Provided email is invalid').isEmail().withMessage('Please enter valid email').normalizeEmail(),
    body('password', `Password length must be ${MIN_PASSWORD_LENGTH} characters min`)
        .isLength({ min: MIN_PASSWORD_LENGTH })
        .trim()
];

export const addProductValidators = [
    body('title', 'Title must contain at least one character').isLength({ min: 1 }).trim(),
    body('price', 'Price should be of float type').isFloat().trim(),
    body('description', 'Description length should be minimum 5 and maximum 200 characters')
        .isLength({ min: 5, max: 200 })
        .trim()
];

import { body } from 'express-validator';
import User from '../models/user.js';
import { SignupError } from './errors.js';

export const signupValidators = [
    body('email', 'Provided email is invalid')
        .isEmail()
        .custom(async (value, { req }) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) throw new SignupError('This email is already taken!');
            else return true;
        })
        .normalizeEmail(),
    body('password', 'Password length must be 5 characters min').isLength({ min: 5 }).trim(),
    body('confirmPassword', 'Passwords have to match!')
        .custom((value, { req }) => value === req.body.password)
        .trim()
];

export const loginValidators = [
    body('email', 'Provided email is invalid').isEmail().withMessage('Please enter valid email').normalizeEmail(),
    body('password', 'Password has to be valid').isLength({ min: 5 }).trim()
];

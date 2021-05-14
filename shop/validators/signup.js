import { body } from 'express-validator';

export default [
    body('email', 'Provided email is invalid').isEmail(),
    body('password', 'Password length must be 5 characters min').isLength({ min: 5 }),
    body('confirmPassword', 'Passwords have to match!').custom((value, { req }) => value === req.body.password)
];

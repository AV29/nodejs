import User from '../models/user.js';
import { handleValidationErrors, HttpError } from '../utils/errors.js';

export const signup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;

        handleValidationErrors(req);

        const result = await User.signup(email, password, name);
        res.status(201).json({ message: 'User created!', userId: result._id });
    } catch (err) {
        console.log(err);
        if (err instanceof HttpError) {
            return next(err);
        }
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const login = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        handleValidationErrors(req);

        const result = await User.login(email, password);
        res.status(201).json({ message: 'User logged in!', userId: result._id });
    } catch (err) {
        console.log(err);
        if (err instanceof HttpError) {
            return next(err);
        }
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

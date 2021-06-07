import User from '../models/user.js';
import { handleValidationErrors, HttpError } from '../utils/errors.js';

export const signup = async (req, res, next) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password;

        handleValidationErrors(req);

        
    } catch (err) {
        console.log(err);
        if (err instanceof HttpError) {
            return next(err);
        }
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};




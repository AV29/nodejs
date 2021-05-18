import User from '../models/user.js';
import { UserSessionError } from '../utils/errors.js';

export default async (req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    try {
        const user = await User.findById(req.session.user);
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    } catch (err) {
        return next(new UserSessionError('Getting a user for session failed!'));
    }
};

import User from '../models/user.js';
import { DataBaseInteractionError } from '../utils/errors.js';
export default async (req, res, next) => {
    if (req.session.user) {
        try {
            const user = await User.findById(req.session.user);
            if (!user) {
                return next();
            } else {
                req.user = user;
            }
        } catch (err) {
            throw new DataBaseInteractionError(err);
        }
    }
    next();
};

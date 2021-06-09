import User from '../models/user.js';
import { HttpError } from '../utils/errors.js';

export const getStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return next(new HttpError(404, 'Could not find user!'));
        }

        res.status(200).json({ message: 'Post fetched!', status: user.status });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};
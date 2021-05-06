import User from '../models/user.js';

export default async (req, res, next) => {
    try {
        req.user = await User.findById('6093eee54fa0ebc60a8f09d2');
        next();
    } catch (err) {
        console.error(err);
    }
}
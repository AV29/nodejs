import jwt from 'jsonwebtoken';
import { HttpError } from '../utils/errors.js';

export default (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return next(new HttpError(401, 'Not authenticated'));
    }
    let decodedToken;
    try {
        const token = authHeader.split(' ')[1];
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return next(new HttpError(500, 'Token decoding failed'));
    }
    if (!decodedToken) {
        return next(new HttpError(401, 'Not authenticated'));
    }
    req.userId = decodedToken.userId;
    next();
};

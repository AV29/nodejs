const HttpError = require('../error').HttpError;

const checkAuth = function(req, res, next) {
    if(!req.session.user) {
        return next(new HttpError(401, "You are not Authorized"));
    }

    next();
};

module.exports = checkAuth;

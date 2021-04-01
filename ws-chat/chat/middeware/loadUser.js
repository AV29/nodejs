const User = require('../models/user').User;

const loadUser = function(req, res, next) {
    req.user = res.locals.user = null;
    if(!req.session.user) return next();

    User.findById(req.session.user)
        .then(user => {
            req.user = res.locals.user = user;
            next();
        })
        .catch(err => next(err));
};

module.exports = loadUser;

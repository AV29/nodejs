const User = require('../models/user').User;
const AuthError = require('../error').AuthError;
const HttpError = require('../error').HttpError;
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
    User.authorize(req.body.username, req.body.password)
        .then(user => {
            req.session.user = user._id;
            res.send({ });
        })
        .catch(err => {
            if(err instanceof AuthError) {
                return next(new HttpError(403, err.message));
            } else {
                return next(err);
            }
        });
});

module.exports = router;

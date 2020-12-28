const User = require('../models/User').User;
const log = require('../tools/log')(module);
const HttpError = require('../error').HttpError;
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    const registerUser = user => {
       req.session.user = user._id;
       res.send({ });
    };

    User.findOne({ username: username })
        .then(user => {
            console.log(user);
            if(user) {
                if(user.checkPassword(password)) {
                    registerUser(user);
                } else {
                    next(new HttpError(403, "Wrong password"))
                }
            } else {
                const user = new User({ username: username, password: password });
                user.save()
                    .then(registerUser)
                    .catch(err => { log.error(err); next(err); })
            }
        })
        .catch(err => next(err))
});

module.exports = router;

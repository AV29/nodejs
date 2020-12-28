const User = require('../models/user').User;
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ username: username })
        .then(user => {
            if(user) {
                if(user.checkPassword(password)) {
                    // ...200
                } else {
                    // ...403
                }
            } else {
                const user = new User({ username: username, password: password });
                user.save()
                    .then(result => {
                        // 200
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))
});

module.exports = router;

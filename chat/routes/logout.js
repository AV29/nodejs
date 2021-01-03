const express = require('express');
const log = require('../tools/log')(module);
const router = express.Router();

router.post('/', function(req, res, next) {
    const sid = req.session.id;
    req.session.destroy(function (err) {
        customEmitter.emit('session:reload', sid);
        if(err) {
            log.error(err);
            next(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;

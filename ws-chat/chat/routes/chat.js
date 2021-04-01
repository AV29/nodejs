const express = require('express');
const checkAuth = require('../middeware/checkAuth');
const router = express.Router();

router.get('/', checkAuth, function(req, res) {
    res.render('chat');
});

module.exports = router;

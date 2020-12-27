const sendHttpError = function(req, res, next) {
    res.sendHttpError = function (err) {
        res.status(err.status);
        if(res.req.headers['x-requested-with'] === 'XMLHttpRequest') {
            res.json(error);
        } else {
            res.render('error', { error : err });
        }
    };

    next();
};

module.exports = sendHttpError;
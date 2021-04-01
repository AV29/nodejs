const HttpError = require('../error').HttpError;

const errorHandler = function(err, req, res, next) {
    if(typeof err === 'number') {
        err = new HttpError(err);
    }

    if(err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if(req.app.get('env') === 'development') {
            res.status(500);
            res.render('error', {error: err});
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
};

module.exports = errorHandler;

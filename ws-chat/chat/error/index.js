const http = require('http');
const util = require('util');

function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || 'Error';
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

module.exports.HttpError = HttpError;

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, AuthError);

    this.message = message
}
util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

module.exports.AuthError = AuthError;
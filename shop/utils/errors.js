import http from 'http';

export class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.message = message || http.STATUS_CODES[status] || 'Error';
        Error.captureStackTrace(this, HttpError);
    }
}

export class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
        Error.captureStackTrace(this, AuthError);
    }
}

export class SignupError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SignupError';
        Error.captureStackTrace(this, SignupError);
    }
}

export class LoginError extends Error {
    constructor(message) {
        super(message);
        this.name = 'LoginError';
        Error.captureStackTrace(this, LoginError);
    }
}

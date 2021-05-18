import { UserSessionError } from '../utils/errors.js';

export const get404 = async (req, res, next) => {
    res.status(404).render('errors/404', {
        pageTitle: 'Page Not Found',
        path: '/',
        errorMessage: ''
    });
};

export const get500 = async (req, res, next) => {
    res.status(500).render('errors/500', {
        pageTitle: 'Error',
        path: '/',
        errorMessage: ''
    });
};

export const getError = async (req, res, next) => {
    if (req.session.error) {
        const { message, status } = req.session.error;
        req.session.error = null;
        res.status(status || 500).render('errors/error', {
            pageTitle: 'Error',
            path: '/',
            errorMessage: message,
            status: status
        });
    } else {
        next();
    }
};

export const handleAllErrors = async (err, req, res, next) => {
    if(err instanceof UserSessionError) {
        return res.status(500).render('errors/error', {
            pageTitle: 'Error',
            path: '/',
            errorMessage: err.message,
            isAuthenticated: false,
            status: 500
        });
    }

    if (req.session) {
        req.session.error = {
            message: err.message,
            status: err.status
        };
        return res.redirect('/error');
    } else {
        return res.redirect('/500');
    }
};

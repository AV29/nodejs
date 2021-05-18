import { validationResult } from 'express-validator';
import sendMail from '../utils/sendMail.js';
import { HttpError, LoginError, ResetPasswordError } from '../utils/errors.js';
import User from '../models/user.js';

export const getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isAuthenticated: false,
        path: '/login',
        errorMessage: req.flash('error')[0],
        validationErrors: [],
        inputState: {
            email: '',
            password: ''
        }
    });
};

export const postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/login', {
                pageTitle: 'Login',
                isAuthenticated: false,
                path: '/login',
                errorMessage: errors.array()[0].msg,
                inputState: {
                    email: email,
                    password: password
                },
                validationErrors: errors.array()
            });
        }
        req.session.user = await User.login(email, password);
        req.session.isAuthenticated = true;
        await req.session.save();
        res.redirect('/');
    } catch (err) {
        if (err instanceof LoginError) {
            return res.status(422).render('auth/login', {
                pageTitle: 'Login',
                isAuthenticated: false,
                path: '/login',
                errorMessage: err.message,
                inputState: {
                    email: email,
                    password: password
                },
                validationErrors: []
            });
        } else {
            return next(new HttpError(500, 'Authenticating user failed!'));
        }
    }
};

export const getSignup = async (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        isAuthenticated: false,
        path: '/signup',
        inputState: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: [],
        errorMessage: req.flash('error')[0]
    });
};

export const postSignup = async (req, res, next) => {
    try {
        const { email, password, confirmPassword } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('auth/signup', {
                pageTitle: 'Signup',
                isAuthenticated: false,
                path: '/signup',
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                inputState: {
                    email: email,
                    password: password,
                    confirmPassword: confirmPassword
                }
            });
        }
        await User.signup(email, password);
        res.redirect('/login');
        return await sendMail({
            to: req.body.email,
            subject: 'Registration',
            html: '<h1>You have successfully registered!</h1>'
        });
    } catch (err) {
        return next(new HttpError(500, 'Signing up failed!'));
    }
};

export const postLogout = async (req, res, next) => {
    try {
        await req.session.destroy();
        res.redirect('/');
    } catch (err) {
        return next(new HttpError(500, 'Logging out failed!'));
    }
};

export const getReset = async (req, res, next) => {
    res.render('auth/reset', {
        pageTitle: 'Reset Password',
        path: '/reset',
        errorMessage: req.flash('error')[0]
    });
};

export const postReset = async (req, res, next) => {
    try {
        const user = await User.setResetPasswordToken(req.body.email);
        res.redirect('/');
        await sendMail({
            to: req.body.email,
            subject: 'Reset password',
            html: `
                <p>You required password reset!</p>
                <p>Click this <a href="http://localhost:3000/reset/${user.resetToken}">link</a></p>
            `
        });
    } catch (err) {
        if (err instanceof ResetPasswordError) {
            req.flash('error', err.message);
            res.redirect('/reset');
        } else {
            return next(new HttpError(500, 'Resetting password failed!'));
        }
    }
};

export const getNewPassword = async (req, res, next) => {
    try {
        const user = await User.findUserByResetToken(req.params.token);
        res.render('auth/new-password', {
            pageTitle: 'New Password',
            path: '/new-password',
            userId: user._id.toString(),
            passwordToken: req.params.token,
            errorMessage: req.flash('error')[0]
        });
    } catch (err) {
        if (err instanceof ResetPasswordError) {
            req.flash('error', err.message);
            res.redirect('/login');
        } else {
            return next(new HttpError(500, 'Getting to reset password failed!'));
        }
    }
};

export const postNewPassword = async (req, res, next) => {
    try {
        const newPassword = req.body.password;
        const userId = req.body.userId;
        const passwordToken = req.body.passwordToken;
        await User.resetPassword(newPassword, userId, passwordToken);
        res.redirect('/login');
    } catch (err) {
        if (err instanceof ResetPasswordError) {
            req.flash('error', err.message);
            res.redirect('/login');
        } else {
            return next(new HttpError(500, 'Setting new password failed!'));
        }
    }
};

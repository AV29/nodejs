import sendMail from '../utils/sendMail.js';
import User from '../models/user.js';

export const getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isAuthenticated: false,
        path: '/login',
        errorMessage: req.flash('error')[0]
    });
};

export const postLogin = async (req, res, next) => {
    try {
        req.session.user = await User.login(req.body.email, req.body.password);
        req.session.isAuthenticated = true;
        await req.session.save();
        res.redirect('/');
    } catch (err) {
        req.flash('error', err);
        res.redirect('/login');
    }
};

export const getSignup = async (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        isAuthenticated: false,
        path: '/signup',
        errorMessage: req.flash('error')[0]
    });
};

export const postSignup = async (req, res, next) => {
    try {
        await User.signup(req.body.email, req.body.password, req.body.confirmPassword);
        res.redirect('/login');
        sendMail({
            to: req.body.email,
            subject: 'Registration',
            html: '<h1>You have successfully registered!</h1>'
        }).catch(err => console.log('HEY!!!', err));
    } catch (err) {
        req.flash('error', err);
        res.redirect('/signup');
    }
};

export const postLogout = async (req, res, next) => {
    try {
        await req.session.destroy();
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
};

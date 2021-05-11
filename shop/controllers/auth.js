import User from '../models/user.js';

export const getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isAuthenticated: req.session.isAuthenticated,
        path: '/login'
    });
};

export const postLogin = async (req, res, next) => {
    try {
        req.session.user = await User.findById('6093eee54fa0ebc60a8f09d2');
        req.session.isAuthenticated = true;
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err); 
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

import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export const getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isAuthenticated: false,
        path: '/login'
    });
};

export const postLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email: email });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                req.session.user = user;
                req.session.isAuthenticated = true;
                await req.session.save();
                res.redirect('/');
            } else {
                res.redirect('/login');
            }
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        res.redirect('/login');
        console.error(err);
    }
};

export const postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            res.redirect('/signup');
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            await user.save();
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
    }
};

export const getSignup = async (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: 'Signup',
        isAuthenticated: false,
        path: '/signup'
    });
};

export const postLogout = async (req, res, next) => {
    try {
        await req.session.destroy();
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
};

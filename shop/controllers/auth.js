export const getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/auth/login'
    });
};
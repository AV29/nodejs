export const getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        isAuthenticated: req.isAuthenticated,
        path: '/login'
    });
};

export const postLogin = async (req, res, next) => {
    req.session.isAuthenticated = true;
    res.redirect('/admin/products');
};

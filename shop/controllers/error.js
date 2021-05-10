export const get404 = async (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        isAuthenticated: req.isAuthenticated,
        path: '/',
        errorMessage: ''
    });
};

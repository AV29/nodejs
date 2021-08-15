export default (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw new Error('Test Error');
    }
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    next();
};

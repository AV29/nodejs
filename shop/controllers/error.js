export const get404 = async (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/',
        errorMessage: ''
    });
};

export const get500 = async (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/',
        errorMessage: ''
    });
};

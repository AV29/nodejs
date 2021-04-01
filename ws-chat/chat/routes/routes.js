module.exports = function (app) {
    const indexRouter = require('./index');
    const usersRouter = require('./users');
    const loginRouter = require('./login');
    const logoutRouter = require('./logout');
    const chatRouter = require('./chat');

    app.use('/', indexRouter);
    app.use('/users', usersRouter);
    app.use('/login', loginRouter);
    app.use('/logout', logoutRouter);
    app.use('/chat', chatRouter);
    app.use('*', (req, res, next) => next(404));
};
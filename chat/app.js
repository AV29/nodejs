const cookieParser = require('cookie-parser');
const debug = require('debug')('chat:server');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const log = require('./tools/log')(module);
const mongoose = require('./tools/mongoose');
const express = require('express');
const config = require('config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    resave: config.get("session:resave"),
    saveUninitialized: config.get("session:saveUninitialized"),
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

app.use(function(req, res, next) {
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    next();
});
app.use(require('./middeware/sendHttpError'));

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('*', (req, res, next) => next(404));
app.use(require('./middeware/errorHandler'));

const server = http.createServer(app).listen(config.get('port'), function(err) {
    if(err) {
        log.error('Something went wrong');
    } else {
        log.info(`Listening on port: ${config.get('port')}`);
    }
});

server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof config.get('port') === 'string'
        ? 'Pipe ' + config.get('port')
        : 'Port ' + config.get('port');

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = app;

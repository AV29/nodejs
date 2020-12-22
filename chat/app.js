const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const debug = require('debug')('chat:server');
const http = require('http');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const log = require('./tools/log')(module);
const express = require('express');
const config = require('config');

const app = express();
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


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

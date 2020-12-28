const log = require('./log')(module);
const debug = require('debug')('chat:server');
const http = require('http');
const config = require('../config');

module.exports = app => {
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
};


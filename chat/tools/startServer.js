const log = require('./log')(module);
const http = require('http');
const createSocket = require('../socket');
const config = require('../config');

module.exports = app => {
    const server = http.createServer(app);
    const io = createSocket(server);
    server.listen(config.get('port'), function(err) {
        if(err) {
            log.error('Something went wrong');
        } else {
            log.info(`Listening on port: ${config.get('port')}`);
        }
    });
};

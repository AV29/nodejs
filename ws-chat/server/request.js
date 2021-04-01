const url = require('url');
const log = require('./logger')(module);

module.exports = (req, res) => {
    let parsedURL = url.parse(req.url, true);

    log.info("Got request", req.method, req.url);

    if (parsedURL.pathname === '/echo' && parsedURL.query.message) {
        const message = parsedURL.query.message;
        log.debug(`Echo ${message}`);
        res.statusCode = 200;
        res.setHeader('Cache-control', 'no-cache');
        res.end(message);
    } else {
        res.statusCode = 404;
        res.end('Page not found!');
        log.error("ERROR")
    }
};

let http = require('http');
let url = require('url');

let server = new http.Server((req, res) => {
    console.log(req.headers);

    let parsedURL = url.parse(req.url, true);

    if(parsedURL.pathname === '/echo' && parsedURL.query.message) {
        res.statusCode = 200;
        res.setHeader('Cache-control', 'no-cache');
        res.end(parsedURL.query.message);
    } else {
        res.statusCode = 404;
        res.end('Page not found!');
    }

}).listen(1337, '127.0.0.1');

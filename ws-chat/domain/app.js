const domain = require('domain');
const serverDomain = domain.create();

let server;

serverDomain.on('error', function(err) {
    console.error("Server error", err);
    if(server) server.close();

    setTimeout(function() {
        process.exit(1);
    }, 1000).unref();
});

serverDomain.run(function() {
    const http = require('http');
    const handler = require('./handler');

    server = http.createServer(function(req, res) {
        const reqDomain = domain.create();
        reqDomain.add(req);
        reqDomain.add(res);

        reqDomain.on('error', function(err) {
           res.statusCode = 500;
           res.end(`Sorry, ${err}`);
           console.error(`Error for req = ${req}`);

           serverDomain.emit(`error ${err}`);
        });

        reqDomain.run(function () {
            handler(req, res);
        })
    });
});
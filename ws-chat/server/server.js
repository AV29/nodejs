let http = require('http');
// let requestHandler = require('./request');
let streamRequestHandler = require('./streamRequest');
let server = new http.Server(streamRequestHandler).listen(1337, '127.0.0.1');

const http = require('http');
const fs = require('fs');
const chat = require('./chat');


const port  = !isNaN(Number(process.argv[2])) ? process.argv[2] : 3000;

http.createServer(function(req, res) {

    switch(req.url) {
        case '/':
            sendFile('index.html', res);
            break;


        case '/subscribe':
            chat.subscribe(req, res);
            break;


        case '/publish':
            let body = '';
            req
                .on('readable', function() {
                    body += req.read() || '';

                    if(body.length > 1e4) {
                        res.statusCode = 413;
                        res.end("Your message is too big!");
                    }
                })
                .on('end', function() {
                    try {
                        body = JSON.parse(body);
                    } catch (err) {
                        res.statusCode = 400;
                        res.end("Bad request");
                        return;
                    }

                    chat.publish(body.message);
                    res.end('ok');
                });
            break;


        default:
            res.statusCode = 404;
            res.end('Not found');

    }
}).listen(port, err => {
    if(err) {
        console.error(err);
    } else {
        console.log(`Listening on ${port}`);
    }
});

function sendFile(fileName, res) {
    const fileStream = fs.createReadStream(fileName);
    fileStream
        .on('error', function() {
            res.statusCode = 500;
            res.end("Server error");
        })
        .pipe(res)
        .on('close', function() {
            fileStream.destroy();
        });
}
const fs = require('fs');
const http = require('http');

http.createServer((req, res) => {
    const { url, method } = req;

    if(url === '/') {
        res.write("<html>");
        res.write("<head><title>Simple NodeJS server</title></head>");
        res.write("<body><form method='POST' action='/message'><input type='text' name='message'><input type='submit'></form></body>");
        res.write("</html>");
        return res.end();
    }

    if(url === '/message' && method === 'POST') {
        const message = [];
        req.on('data', chunk => {
            message.push(chunk);
        })
        return req.on('end', () => {
            const parsedMessage = Buffer.concat(message).toString();
            fs.writeFileSync('test.txt', parsedMessage.split('=')[1]);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }
    res.setHeader('Content-Type', 'text/html');
    res.write("<html>");
    res.write("<head><title>Simple NodeJS server</title></head>");
    res.write("<h1>Hello from NodeJS server</h1>");
    res.write("</html>");
    res.end();
}).listen(3000);


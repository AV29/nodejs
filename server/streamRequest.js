const url = require('url');
const fs = require('fs');

/** finish, drain */
module.exports = (req, res) => {
    // res instanceof http.ServerResponse < stream.Writable

    if(req.url === '/big.txt') {
        const file = new fs.ReadStream('./big.txt');
        // file - readable stream, res - writable stream
        sendFile(file, res)
    }
};

function sendFile(file, res) {
    file.on('readable', write);

    function write() {
        const fileContent = file.read(); // Read

        if(fileContent && !res.write(fileContent)) {
            file.removeListener('readable', write); // Write

            res.once('drain', function() { // Wait for drain
                file.on('readable', write);
                write();
            })
        }
    }

    file.on('end', function() {
       res.end();
    });

    file.on('error', makeErrorHandler(res));
    res.on('close', makeCloseHandler(file));
}

/** Native implementation: easy peasy plus can pipe on multiple writable streams */
function sendFile_Native(file, res) {
    file.pipe(res);
    file.pipe(process.stdout);

    file.on('error', makeErrorHandler(res));
    res.on('close', makeCloseHandler(file)); // Extended, close event of writable stream. If something went wrong and connection broke not finished
}

const makeErrorHandler = res => err => {
    if(err.code === 'ENOENT') {
        console.log('No such file');
    } else {
        res.statusCode = 500;
        res.end('Server Error');
        console.error(err);
    }
};

const makeCloseHandler = file => () => {
    file.destroy();
};
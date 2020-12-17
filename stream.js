/** Stream is a JS object that can work with data source. fs.ReadStream implements standard interface that is defined in fs.Readable*/

/** Stream reads a chunk of data putting it in it's inner buffer that releases it after read. Saves memory.
 *  no matter how big is our data only a chunk will be handled at once */

/** Streams should be universal,  implementing EvenEmitter interface*/

/** events: open, readable, end, close, error*/
/** readable event occurs when part of the data is read and can be accessed via .read() method from stream's buffer */

let fs = require('fs');

let stream = fs.ReadStream(__filename, { encoding: 'utf-8' }); // current file (fs.ReadStream inherits stream.Readable)

stream.on('open', function() {
    console.log('OPENED');
});

stream.on('readable', function() {
    console.log('READABLE');
    let data = stream.read();
    if(!data) {
        stream.destroy();
    } else {
        console.log(data.length);
    }
});

stream.on('end', function() {
    console.log('THE END');
});

stream.on('close', function() {
    console.log('CLOSED');
});

stream.on('error', function(err) {
    if(err.code === 'ENOENT') {
        console.log('No such file');
    } else {
        console.error(err);
    }
});

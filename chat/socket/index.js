module.exports = server => {
    const io = require('socket.io')(server);



    io.on('connection', socket => {
        socket.on('message', function(text) {
            io.emit('message', text);
        });
    });

    // io.use((socket, next) => {
    //     log.info(`Got connection from ${socket.id}`);
    //     next();
    // });
};

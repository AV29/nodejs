import { Server } from 'socket.io';

function Socket() {
    let io;

    this.init = function (httpServer) {
        io = new Server(httpServer, {
            cors: {
                origin: 'http://localhost:3000'
            }
        });
        return io;
    };

    this.getIO = function () {
        if (!io) {
            throw new Error('Socket IO is not initialized');
        }
        return io;
    };
}

export default new Socket();

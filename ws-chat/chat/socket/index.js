const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const log = require('../tools/log')(module);
const User = require('../models/user').User;
const HttpError = require('../error').HttpError;
const sessionStore = require('../tools/sessionStore');
const config = require('../config');

function loadSession(sid) {
    return sessionStore.get(sid);
}

function handleSession (handshake, sid, next) {
    return session => {
        if(!session) {
            next(new HttpError(401, "No Session"));
        }
        handshake.session = session;
        handshake.session.id = sid; // Can't get id of the session from MongoStore sessions collection
        return session;
    }
}

function loadUser(session) {
    log.info('Loading user...');
    return User.findById(session.user)
}

function handleUser (handshake, next) {
    return user => {
        if(!user) {
            next(new HttpError(403, "No anonymous sessions"));
        }
        handshake.user = user;
        next();
    }
}

module.exports = server => {
    const io = require('socket.io')(server);

    io.on('connection', socket => {
        log.info('Connected!');
        const username = socket.handshake.user.get('username');
        socket.broadcast.emit('join', username);
        socket.on('message', function(text) {
            // broadcast through every connection: io.emit('message', text);
            socket.broadcast.emit('message', username, text); // through all but this
        });

        socket.on('disconnect', function () {
            socket.broadcast.emit('leave', username)
        });
    });

    customEmitter.on('session:reload', function(sid) {
        io.sockets.sockets.forEach(client => {
            if(client.handshake.session.id !== sid) return;
            loadSession(sid)
                .then(session => {
                    if(!session) {
                        client.emit('logout');
                        client.disconnect();
                        return;
                    }
                    client.handshake.session = session;
                    client.handshake.session.id = sid;
                })
                .catch(err => {
                    client.emit('error', 'server error');
                    client.disconnect();
                });
        });
    });

    io.use((socket, next) => {
        log.info('Parsing cookie...');
        const handshake = socket.handshake;
        handshake.cookies = cookie.parse(handshake.headers.cookie || '');
        const sidCookie = handshake.cookies[config.get('session:key')];
        const sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));

        loadSession(sid)
            .then(handleSession(handshake, sid, next))
            .then(loadUser)
            .then(handleUser(handshake, next))
            .catch(next);
    });
};

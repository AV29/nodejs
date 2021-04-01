const mongoose = require('./tools/mongoose');
const log = require('./tools/log')(module);

const open = () => new Promise((resolve, reject) => {
    mongoose.connection.on('open', function (err) {
        if (err) reject(err);
        log.info('Opening...');
        resolve();
    });
});

const dropDatabase = () => new Promise((resolve, reject) => {
    mongoose.connection.db.dropDatabase()
        .then(() => {
            log.info('Dropped!');
            resolve();
        })
        .catch(reject);
});

const requireModels = () => {
    log.info('Requiring Models...');
    require('./models/user');
    return Promise.all(Object.keys(mongoose.models).map(model =>
        mongoose.models[model].createIndexes()
    ));
};

const createUsers = () => new Promise((resolve, reject) => {
    log.info('Creating Users...');
    const users = [
        { username: 'Ksu', password: '456789' },
        { username: 'Mark', password: '098765' },
        { username: 'Anton', lastname: 'Vlasik', password: '123456' }
    ];
    Promise
        .all(users.map(user => new mongoose.models.User(user).save()))
        .then(results => {
            console.log(results);
            resolve(results);
        })
        .catch(reject);
});

const logError = err => {
    log.error(err.message);
    close(255);
};


const close = (exitCode = 0) => {
    log.info('Disconnecting...');
    mongoose.disconnect();
    process.exit(exitCode);
};

open()
    .then(dropDatabase)
    .then(requireModels)
    .then(createUsers)
    .then(close)
    .catch(logError);

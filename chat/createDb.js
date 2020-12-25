const mongoose = require('./tools/mongoose');
const log = require('./tools/log')(module);

const open = () => new Promise((resolve, reject) => {
    mongoose.connection.on('open', function (err) {
        if (err) reject(err);
        resolve();
    })
});


const dropDatabase = () => new Promise((resolve, reject) => {
    mongoose.connection.db.dropDatabase()
        .then(() => {
            log.info('DROPPED');
            resolve();
        })
        .catch(reject);
});

const createUsers = () => new Promise((resolve, reject) => {
    log.info('Creating Users...');
    require('./models/user');
    const users = [{ username: 'Anton', password: '123456' }, { username: 'Mark', password: '098765' }, { username: 'Ksu', password: '456789' }];

    Promise
        .all(users.map(user => new mongoose.models.User(user).save()))
        .then(results => {
            console.log(results);
            resolve(results);
        })
        .catch(reject)
});


const close = () => {
    log.info('Disconnecting...');
    mongoose.disconnect();
};

open()
    .then(dropDatabase)
    .then(createUsers)
    .catch(err => log.error('ERROR', err))
    .finally(close);

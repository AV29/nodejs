const db = require('db');
const log = require('logger')(module);
const User = require('./user');

db.connect();

function run () {
    const vasya = new User("Vasya");
    const petya = new User("Petya");

    vasya.hello(petya);

    log(db.getPhrase('runSuccessful'));
}

if(module.parent) {
    module.exports.run = run;
} else {
    run();
}
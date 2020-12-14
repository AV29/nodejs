const db = require('db');
const User = require('./user');

function run () {
    const vasya = new User("Vasya");
    const petya = new User("Petya");

    vasya.hello(petya);

    console.log(db.getPhrase('runSuccessful'));
}

if(module.parent) {
    module.exports.run = run;
} else {
    run();
}
const db = require('db');
const log = require('logger')(module);

function User(name) {
    this.name = name;
}

User.prototype.hello = function(who) {
    log(`${db.getPhrase('hello')} from ${this.name} to ${who.name}`);
};

module.exports = User;

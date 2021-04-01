let phrases;

module.exports.connect = function() {
    phrases = require('./ru.json');
};

module.exports.getPhrase = function(name) {
    if(!phrases[name]) {
        throw new Error(`No phrase found: ${name}`);
    }

    return phrases[name];
};

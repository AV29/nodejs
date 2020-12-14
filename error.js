const util = require('util');
const phrases = { "Hello": "Hello", "world": "world" };

function PhraseError(message) {
    this.message = message;
    Error.captureStackTrace(this, PhraseError);
}
util.inherits(PhraseError, Error);
PhraseError.prototype.name = 'PhraseError';

function HttpError(status, message) {
    this.status = status;
    this.message = message;
    Error.captureStackTrace(this, HttpError);
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';


function getPhrase(name) {
    if(!phrases[name]) {
        throw new PhraseError(`No such word as: ${name}`)
    }
    return phrases[name];
}

function makePage(url) {
    if(url !== 'index.html') {
        throw new HttpError(404, 'Page not found');
    }

    return util.format("%s, %s!", getPhrase('Hell'), getPhrase('world'));
}

try {
    let page = makePage('index.html');
    console.log(page);
} catch (err) {
    if(err instanceof HttpError) {
        console.log(err.status, err.message);
    } else {
        console.error(`Error %s\n message: %s\n stack: %s`, err.name, err.message, err.stack);
    }
}

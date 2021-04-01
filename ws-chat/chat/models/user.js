const crypto = require('crypto');
const AuthError = require('../error').AuthError;
const mongoose = require('../tools/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    lastname: {
        type: String
    },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(password) {
    return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
};

schema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = Math.random().toString();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

schema.statics.authorize = function(username, password) {
    const User = this;
    return new Promise((resolve, reject) => {
        User.findOne({ username: username })
            .then(user => {
                if(user) {
                    if(user.checkPassword(password)) {
                        resolve(user);
                    } else {
                        reject(new AuthError("Wrong password"))
                    }
                } else {
                    const user = new User({ username: username, password: password });
                    user.save()
                        .then(user => resolve(user))
                        .catch(err => reject(err))
                }
            })
            .catch(err => reject(err))
    });
};

module.exports.User = mongoose.model('User', schema);
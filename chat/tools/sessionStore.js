const mongoose = require('../tools/mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

module.exports = new MongoStore({
    mongooseConnection: mongoose.connection
});
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');
const applyRoutes = require('./routes/routes');
const startServer = require('./tools/startServer');
const mongoose = require('./tools/mongoose');
const express = require('express');
const config = require('config');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: config.get("session:secret"),
    key: config.get("session:key"),
    cookie: config.get("session:cookie"),
    resave: config.get("session:resave"),
    saveUninitialized: config.get("session:saveUninitialized"),
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(require('./middeware/numberOfVisits'));
app.use(require('./middeware/sendHttpError'));
applyRoutes(app);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('./middeware/errorHandler'));

startServer(app);

module.exports = app;

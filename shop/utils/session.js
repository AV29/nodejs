import session from 'express-session';
import InitializeMongoDBStore from 'connect-mongodb-session';
import { MONGODB_URI } from './constants.js';

const MongoDBStore = InitializeMongoDBStore(session);
const sessionStore = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

export default session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: null,
        httpOnly: true
    },
    store: sessionStore
});

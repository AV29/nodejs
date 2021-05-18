import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import flash from 'connect-flash';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import getSession from './middlewares/getSession.js';
import getUser from './middlewares/getUser.js';
import getViewData from './middlewares/getViewData.js';
import MONGODB_URI from './utils/constants.js';
import * as errorController from './controllers/error.js';

const app = express();
const protectCSRF = csrf({ cookie: false });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(getSession);
app.use(protectCSRF);
app.use(flash());
app.use(getUser);
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
app.use(getViewData);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.get('/500', errorController.get500);
app.get('/error', errorController.getError);
app.use(errorController.get404);
app.use(errorController.handleAllErrors);

try {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    app.listen(3000);
} catch (err) {
    console.log(err);
}

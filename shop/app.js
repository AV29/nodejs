import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import csrf from 'csurf';
import flash from 'connect-flash';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import errorRoutes from './routes/error.js';
import getSession from './middlewares/getSession.js';
import imageUpload from './middlewares/imageUpload.js';
import getUser from './middlewares/getUser.js';
import getViewData from './middlewares/getViewData.js';
import MONGODB_URI from './utils/constants.js';
import { handleAllErrors } from './controllers/error.js';

const app = express();
const protectCSRF = csrf({ cookie: false });
const rootPath = path.dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'ejs');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(imageUpload);
app.use(getSession);
app.use(protectCSRF);
app.use(flash());
app.use(express.static(path.join(rootPath, 'public')));
app.use(getUser);
app.use(getViewData);
app.use(shopRoutes);
app.use(authRoutes);
app.use('/admin', adminRoutes);
app.use(errorRoutes);
app.use(handleAllErrors);

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

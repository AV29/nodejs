import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import csrf from 'csurf';
import multer from 'multer';
import flash from 'connect-flash';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import errorRoutes from './routes/error.js';
import getSession from './middlewares/getSession.js';
import getUser from './middlewares/getUser.js';
import getViewData from './middlewares/getViewData.js';
import MONGODB_URI from './utils/constants.js';
import { handleAllErrors } from './controllers/error.js';

const app = express();
const protectCSRF = csrf({ cookie: false });
const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        callback(null, `${new Date().toISOString()}_${file.originalname}`);
    }
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ storage: fileStorage }).single('image'));
app.use(getSession);
app.use(protectCSRF);
app.use(flash());
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
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

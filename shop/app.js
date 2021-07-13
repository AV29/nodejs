import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import csrf from 'csurf';
import flash from 'connect-flash';
import path from 'node:path';
import fs from 'node:fs';
//import https from 'node:https';
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
const accessLogStream = fs.createWriteStream(path.join(rootPath, 'access.log'), { flags: 'a' });
//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');
app.set('view engine', 'ejs');
app.use(helmet());
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));
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
    //https.createServer({ key: privateKey, cert: certificate }, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000);
} catch (err) {
    console.log(err);
}

// openssl req -nodes -new -x509 -keyout server.key -out server.cert

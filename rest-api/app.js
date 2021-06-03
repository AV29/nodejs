import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import feedRoutes from './routes/feed.js';
import MONGODB_URI from './utils/constants.js';
import cors from './middlewares/cors.js';
import handleAllErrors from './middlewares/error.js';

const rootPath = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(bodyParser.json());
app.use('/images', express.static(path.join(rootPath, 'images')));
app.use(cors);
app.use('/feed', feedRoutes);
app.use(handleAllErrors);

try {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    app.listen(8080);
} catch (err) {
    console.log(err);
}

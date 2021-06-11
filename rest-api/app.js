import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import feedRoutes from './routes/feed.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import MONGODB_URI from './utils/constants.js';
import cors from './middlewares/cors.js';
import handleAllErrors from './middlewares/error.js';
import imageUpload from './middlewares/imageUpload.js';

const rootPath = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(bodyParser.json());
app.use(imageUpload);
app.use('/images', express.static(path.join(rootPath, 'images')));
app.use(cors);
app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use(handleAllErrors);

try {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    const server = app.listen(8080);
    const io = new Server(server);
    io.on('connection', socket => {
        console.log('Client connected!!');
    });
} catch (err) {
    console.log(err);
}

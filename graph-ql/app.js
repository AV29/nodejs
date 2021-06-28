import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import MONGODB_URI from './utils/constants.js';
import cors from './middlewares/cors.js';
import handleAllErrors from './middlewares/error.js';
import imageUpload from './middlewares/imageUpload.js';
import checkAuth from './middlewares/checkAuth.js';
import graphql from './middlewares/graphql.js';
import { deleteFile } from './utils/file.js';

const rootPath = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(bodyParser.json());
app.use(imageUpload);
app.use('/images', express.static(path.join(rootPath, 'images')));
app.use(cors);
app.use(checkAuth);
app.put('/post-image', async (req, res, next) => {
    if(!req.isAuth) {
        throw new HttpError(401, 'Not authenticated!');
    }
    if (!req.file) {
        return res.status(200).json({ message: 'No file provided!' });
    }

    if (req.body.oldPath) {
        await deleteFile(req.body.oldPath);
    }

    return res.status(201).json({ message: 'File stored', filePath: req.file.path });
});
app.use('/graphql', graphql);
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

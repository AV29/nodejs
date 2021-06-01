import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import feedRoutes from './routes/feed.js';
import MONGODB_URI from './utils/constants.js';
import cors from './middlewares/cors.js';

const app = express();
app.use(bodyParser.json());
app.use(cors);
app.use('/feed', feedRoutes);

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

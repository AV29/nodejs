import express from 'express';
import bodyParser from 'body-parser';
import feedRoutes from './routes/feed.js';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/feed', feedRoutes);

try {
    app.listen(8080);
} catch (err) {
    console.log(err);
}

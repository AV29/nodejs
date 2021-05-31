import express from 'express';
import bodyParser from 'body-parser';
import feedRoutes from './routes/feed.js';

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/feed', feedRoutes);

try {
    app.listen(8080);
} catch (err) {
    console.log(err);
}

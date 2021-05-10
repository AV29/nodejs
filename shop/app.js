import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import getUser from './middlewares/getUser.js';
import User from './models/user.js';
import * as errorController from './controllers/error.js';

const app = express();

app.set('view engine', 'ejs');
app.use(getUser);
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

try {
    await mongoose.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6o14s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );
    const user = await User.findOne();
    if (!user) {
        const user = new User({
            name: 'Anton',
            email: 'snumber29@gmail.com',
            cart: {
                items: []
            }
        });
        user.save();
    }
    app.listen(3000);
} catch (err) {
    console.log(err);
}

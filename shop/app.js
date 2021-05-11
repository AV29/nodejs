import express from 'express';
import mongoose from 'mongoose';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bodyParser from 'body-parser';
import shopRoutes from './routes/shop.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import User from './models/user.js';
import getSession from './utils/session.js';
import { MONGODB_URI } from './utils/constants.js';
import * as errorController from './controllers/error.js';

const app = express();

app.set('view engine', 'ejs');
app.use(getSession);
app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
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

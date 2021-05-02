const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.use(async (req, res, next) => {
    try {
        const user = await User.findById('000000015a6aea6fc450f4f0');
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    } catch (err) {
        console.error(err);
    }
});
app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6o14s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

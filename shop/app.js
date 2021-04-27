const express = require('express');
const mongodb = require('mongodb');
const path = require('path');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const { mongoConnect } = require('./utils/database');
const User = require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.use(async (req, res, next) => {
    try {
        req.user = await User.findById("000000015a6aea6fc450f4f0");
    } catch (err) {
        console.error(err);
    }
    next();
});
app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect()
    .then(() => User.findById("000000015a6aea6fc450f4f0"))
    .then(user => {
        if (user) {
            return Promise.resolve(user);
        } else {
            const newUser = new User('Anton', 'snumber29@gmail.com', 1);
            return newUser.save();
        }
    })
    .then(() => {
        app.listen(3000);
    });

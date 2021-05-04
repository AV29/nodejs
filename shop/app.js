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
        req.user = await User.findById('6091a498120a9fbb716ad2f4');
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
    .then(() => User.findOne())
    .then(user => {
        if(!user) {
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
    })
    .catch(err => {
        console.log(err);
    });

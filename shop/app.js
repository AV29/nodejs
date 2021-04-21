const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const User = require('./models/user');
const Product = require('./models/product');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(async (req, res, next) => {
    try {
        req.user = await User.findByPk(1);
        next();
    } catch (err) {
        console.error(err);
    }
});
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    .sync()
    .then(() => User.findByPk(1))
    .then(user => (!user ? User.create({ name: 'Anton', email: 'snumber29@gmail.com' }) : Promise.resolve(user)))
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.error(err);
    });

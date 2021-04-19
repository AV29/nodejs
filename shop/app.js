const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const db = require('./utils/database');
const errorController = require('./controllers/error');

db.execute('SELECT * FROM products')
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    });

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

app.listen(3000);

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const rootDir = require('./utils/path');
// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const mongoConnect = require('./utils/database');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(rootDir, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect()
    .then(result => {
        console.log(result);
        app.listen(3000);
    })
    .catch(err => console.error(err));

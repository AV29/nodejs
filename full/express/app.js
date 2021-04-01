const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('The First middleware');
    next();
});

app.use((req, res, next) => {
    console.log('The Second middleware');
    next();
});

app.use((req, res, next) => {
    res.send('Hello world!');
});

app.listen(3000);
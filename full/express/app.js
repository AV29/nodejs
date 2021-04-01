const express = require('express');

const app = express();

app.use('/users', (req, res) => {
    res.send('/users got');
});

app.use('/', (req, res) => {
    res.send('/ got');
});

app.listen(3000);
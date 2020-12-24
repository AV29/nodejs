const User = require('./models/user').User;

const user = new User({
    username: 'Anton',
    password: '123456'
});

user.save().then(user => {
    console.log(user);
}).catch(err => {
    console.error(err);
});
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = () =>
    MongoClient.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6o14s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );

module.exports = mongoConnect;

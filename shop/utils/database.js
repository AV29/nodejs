const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () =>
    MongoClient.connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6o14s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
        { useUnifiedTopology: true }
    )
        .then(client => {
            _db = client.db();
            return _db;
        })
        .catch(err => {
            return Promise.reject(err);
        });

const getDb = () => {
    if (!_db) {
        throw 'No database found!';
    }

    return _db;
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;

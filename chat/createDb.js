const MongoClient = require('mongodb').MongoClient;
const format = require('util').format;

// Connection URL
const url = 'mongodb://localhost:27017/chat';

// Database Name
const dbName = 'chat';

const insertRecord = function(db, record) {
    return new Promise((resolve, reject) => {
        const collection = db.collection(dbName);
        collection.insertOne(record).then(resolve);
    });
};

// Use connect method to connect to the server
MongoClient.connect(url)
    .then((client) => {
        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const record = { anton: new Date() };
        insertRecord(db, record).then(() => {
            client.close();
        });
    })
    .catch(err => console.error(err));
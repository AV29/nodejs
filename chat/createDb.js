const MongoClient = require('mongodb').MongoClient;
const format = require('util').format;

// Connection URL
const url = 'mongodb://localhost:27017/chat';

// Database Name
const dbName = 'chat';

const insertAndCount = function(db) {
    return new Promise((resolve, reject) => {
        const collection = db.collection(dbName);
        collection.insertOne({ anton: 29 }).then(docs => {
            collection.countDocuments().then((err, count) => {
                console.log(format("count = %s", count));
            });

            collection.find().toArray(function(err, results) {
                console.dir(results);
            });

            resolve(docs);
        });
    });

};

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    if(err) throw err;
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    insertAndCount(db).then(() => {
        client.close();
    });
});
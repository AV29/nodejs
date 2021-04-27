const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class User {
    constructor(name, email, id) {
        this._id = new mongodb.ObjectId(id);
        this.name = name;
        this.email = email;
    }

    async save() {
        try {
            const db = getDb();
            return await db.collection('users').insertOne(this);
        } catch (err) {
            console.error(err);
        }
    }

    static async findById(userId) {
        try {
            const db = getDb();
            return await db
                .collection('users')
                .find({ _id: new mongodb.ObjectId(userId) })
                .next();
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = User;

const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class Product {
    constructor(title, price, description, imageUrl, id) {
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    async save() {
        try {
            const db = getDb();
            return this._id
                ? await db.collection('products').updateOne(
                      { _id: this._id },
                      {
                          $set: this
                      }
                  )
                : await db.collection('products').insertOne(this);
        } catch (err) {
            console.error(err);
        }
    }

    static async fetchAll() {
        try {
            const db = getDb();
            return await db.collection('products').find().toArray();
        } catch (err) {
            console.error(err);
        }
    }

    static async findById(prodId) {
        try {
            const db = getDb();
            return await db
                .collection('products')
                .find({ _id: new mongodb.ObjectId(prodId) })
                .next();
        } catch (err) {
            console.error(err);
        }
    }

    static async deleteById(prodId) {
        try {
            const db = getDb();
            return await db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) });
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = Product;

const { getDb } = require('../utils/database');

class Product {
    constructor (title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    async save() {
        try {
            const db = getDb();
            return await db.collection('products').insertOne(this);
        } catch (err) {
            console.error(err);
        }
    }
}

module.exports = Product;

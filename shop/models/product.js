const db = require('../utils/database');
//const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, imageUrl, description) VALUE (?, ?, ?, ?)', [
            this.title,
            this.price,
            this.imageUrl,
            this.description
        ]);
    }

    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    static async findById(id) {}

    static async deleteById(id) {}
};

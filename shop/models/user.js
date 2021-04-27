const mongodb = require('mongodb');
const { getDb } = require('../utils/database');

class User {
    constructor(name, email, cart, id) {
        this.name = name;
        this.email = email;
        this.cart = cart; // { items: [] }
        this._id = id;
    }

    async save() {
        try {
            const db = getDb();
            return await db.collection('users').insertOne(this);
        } catch (err) {
            console.error(err);
        }
    }

    async addToCart(product) {
        // const cartProduct = this.cart.items.findIndex(cp => {
        //     return cp._id === product._id;
        // });
        const updatedCart = { items: [{ productId: mongodb.ObjectId(product._id), quantity: 1 }] };
        const db = getDb();
        return await db.collection('users').updateOne(
            { _id: new mongodb.ObjectId(this._id) },
            {
                $set: { cart: updatedCart }
            }
        );
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

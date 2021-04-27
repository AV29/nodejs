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
        const cartProductIndex = this.cart.items.findIndex(({ productId }) => productId.toString() === product._id.toString());

        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
        } else {
            updatedCartItems.push({ productId: mongodb.ObjectId(product._id), quantity: 1 });
        }
        const updatedCart = { items: updatedCartItems };
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

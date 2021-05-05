const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
});

userSchema.methods.addToCart = async function (product) {
    try {
        const cartProductIndex = this.cart.items.findIndex(
            ({ productId }) => productId.toString() === product._id.toString()
        );

        const updatedCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
        } else {
            updatedCartItems.push({ productId: product._id, quantity: 1 });
        }
        this.cart = { items: updatedCartItems };
        return await this.save();
    } catch (err) {
        console.log(err);
    }
};

module.exports = mongoose.model('User', userSchema);


//     async getCart() {
//         try {
//             const db = getDb();
//             const cartProductIds = this.cart.items.map(item => item.productId);
//             const products = await db
//                 .collection('products')
//                 .find({ _id: { $in: cartProductIds } })
//                 .toArray();
//             return products.map(prod => ({
//                 ...prod,
//                 quantity: this.cart.items.find(cartItem => cartItem.productId.toString() === prod._id.toString())
//                     .quantity
//             }));
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     async deleteItemFromCart(productId) {
//         try {
//             const updatedCartItems = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
//             const db = getDb();
//             return await db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 {
//                     $set: { cart: { items: updatedCartItems } }
//                 }
//             );
//         } catch (err) {
//             console.log(err);
//         }
//     }
//
//     async addOrder() {
//         try {
//             const db = getDb();
//             const products = await this.getCart();
//             const order = {
//                 items: products,
//                 user: {
//                     _id: new mongodb.ObjectId(this._id),
//                     name: this.name,
//                     email: this.email
//                 }
//             };
//             await db.collection('orders').insertOne(order);
//             this.cart = { items: [] };
//             return await db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 {
//                     $set: { cart: this.cart }
//                 }
//             );
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     async getOrders() {
//         try {
//             const db = getDb();
//             return await db
//                 .collection('orders')
//                 .find({ 'user._id': new mongodb.ObjectId(this._id) })
//                 .toArray();
//         } catch (err) {
//             console.error(err);
//         }
//     }

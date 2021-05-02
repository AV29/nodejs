// const mongoose = require('mongoose');
//
// class User {
//     constructor(name, email, cart, id) {
//         this.name = name;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }
//
//     async save() {
//         try {
//             const db = getDb();
//             return await db.collection('users').insertOne(this);
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     async addToCart(product) {
//         try {
//             const cartProductIndex = this.cart.items.findIndex(
//                 ({ productId }) => productId.toString() === product._id.toString()
//             );
//
//             const updatedCartItems = [...this.cart.items];
//
//             if (cartProductIndex >= 0) {
//                 updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
//             } else {
//                 updatedCartItems.push({ productId: mongodb.ObjectId(product._id), quantity: 1 });
//             }
//             const updatedCart = { items: updatedCartItems };
//             const db = getDb();
//             return await db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 {
//                     $set: { cart: updatedCart }
//                 }
//             );
//         } catch (err) {
//             console.log(err);
//         }
//     }
//
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
//
//     static async findById(userId) {
//         try {
//             const db = getDb();
//             return await db
//                 .collection('users')
//                 .find({ _id: new mongodb.ObjectId(userId) })
//                 .next();
//         } catch (err) {
//             console.error(err);
//         }
//     }
// }
//
// module.exports = User;

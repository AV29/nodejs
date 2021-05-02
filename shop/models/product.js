const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);


// const User = require('./user');
//
// class Product {
//     async save() {
//         try {
//             const db = getDb();
//             return this._id
//                 ? await db.collection('products').updateOne(
//                       { _id: this._id },
//                       {
//                           $set: this
//                       }
//                   )
//                 : await db.collection('products').insertOne(this);
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     static async fetchAll() {
//         try {
//             const db = getDb();
//             return await db.collection('products').find().toArray();
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     static async findById(prodId) {
//         try {
//             const db = getDb();
//             return await db
//                 .collection('products')
//                 .find({ _id: new mongodb.ObjectId(prodId) })
//                 .next();
//         } catch (err) {
//             console.error(err);
//         }
//     }
//
//     static async deleteById(prodId, user) {
//         try {
//             const db = getDb();
//             await user.deleteItemFromCart(prodId);
//             return await db.collection('products').deleteOne({ _id: new mongodb.ObjectId(prodId) });
//         } catch (err) {
//             console.error(err);
//         }
//     }
// }

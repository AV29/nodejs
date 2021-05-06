import mongoose from 'mongoose';

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
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Product', productSchema);

// class Product {
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

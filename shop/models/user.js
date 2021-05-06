import mongoose from 'mongoose';

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

userSchema.methods.removeFromCart = async function (productId) {
    try {
        this.cart.items = this.cart.items.filter(item => item.productId.toString() !== productId.toString());
        return await this.save();
    } catch (err) {
        console.log(err);
    }
};

userSchema.methods.clearCart = async function () {
    try {
        this.cart = { items: [] };
        return await this.save();
    } catch (err) {
        console.log(err);
    }
};

export default mongoose.model('User', userSchema);
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

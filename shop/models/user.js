import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
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

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            return user;
        } else {
            throw 'Password is incorrect!';
        }
    } else {
        throw 'No such user!';
    }
};

userSchema.statics.signup = async function (email, password, confirmPassword) {
    const existingUser = await this.findOne({ email: email });
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new this({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });
        return await user.save();
    } else {
        throw 'Already existing user!';
    }
};

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

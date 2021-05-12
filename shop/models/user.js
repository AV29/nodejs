import mongoose from 'mongoose';
//import crypto from 'crypto';

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

/*userSchema
    .virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = Math.random().toString();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
    });

userSchema.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

userSchema.statics.authorize = async function ({ email, password }, onUserExists, onUserCreated) {
    const User = this;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        onUserExists();
    } else {
        const user = new User({
            email: email,
            password: password,
            cart: { items: [] }
        });
        await user.save();
        onUserCreated();
    }
};*/

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

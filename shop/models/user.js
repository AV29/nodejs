import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { SignupError, LoginError, ResetPasswordError } from '../utils/errors.js';

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
    resetToken: String,
    resetTokenExpiration: Date,
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
            throw new LoginError('Password is incorrect!');
        }
    } else {
        throw new LoginError('No such user!');
    }
};

userSchema.statics.signup = async function (email, password, confirmPassword) {
    const existingUser = await this.findOne({ email: email });
    const User = this;
    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });
        return await user.save();
    } else {
        throw new SignupError('This email is already taken!');
    }
};

userSchema.statics.setResetPasswordToken = async function (email) {
    const User = this;
    const token = await crypto.randomBytes(32).toString('hex');
    const user = await User.findOne({ email: email });
    if (user) {
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
        return await user.save();
    } else {
        throw new ResetPasswordError('No account with that email found!');
    }
};

userSchema.statics.findUserByResetToken = async function (resetToken) {
    const User = this;
    const user = await User.findOne({ resetToken: resetToken, resetTokenExpiration: { $gt: Date.now() } });
    if (user) {
        return user;
    } else {
        throw new ResetPasswordError('Either password has already been reset or you have invalid data!');
    }
};

userSchema.statics.resetPassword = async function (newPassword, userId, passwordToken) {
    const User = this;
    const user = await User.findOne({
        _id: userId,
        resetToken: passwordToken,
        resetTokenExpiration: { $gt: Date.now() }
    });
    if (user) {
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetToken = null;
        user.resetTokenExpiration = null;
        return await user.save();
    } else {
        throw new ResetPasswordError('An error occurred while trying to reset password!');
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

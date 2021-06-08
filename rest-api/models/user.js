import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { HttpError } from '../../shop/utils/errors.js';

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        status: {
            type: String,
            default: 'I am new!'
        },
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    },
    { timestamps: true }
);

userSchema.statics.signup = async function (email, password, name) {
    const User = this;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        name: name,
        password: hashedPassword
    });
    return await user.save();
};

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email: email });
    if (user) {
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (isPasswordCorrect) {
            return user;
        } else {
            throw new HttpError(401, 'Password is incorrect!');
        }
    } else {
        throw new HttpError(401, `We could not find ${email} user`);
    }
};

export default mongoose.model('User', userSchema);

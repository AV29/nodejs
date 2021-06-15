import User from '../models/user.js';
import { HttpError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';

export default {
    createUser: async function (args, req) {
        const {
            userInput: { email, name, password }
        } = args;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new HttpError(401, 'User Already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            email: email,
            name: name,
            password: hashedPassword
        });

        const createdUser = await user.save();

        return {
            ...createdUser.toJSON(),
            _id: createdUser._id.toString()
        };
    }
};

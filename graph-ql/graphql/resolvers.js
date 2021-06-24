import validator from 'validator';
import User from '../models/user.js';
import Post from '../models/post.js';
import { HttpError } from '../utils/errors.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default {
    createUser: async function (args, req) {
        const {
            userInput: { email, name, password }
        } = args;
        const errors = [];
        if (!validator.isEmail(email)) {
            errors.push({ message: 'email is invalid' });
        }
        if (validator.isEmpty(password) || !validator.isLength(password, { min: 5 })) {
            errors.push({ message: 'password is too short' });
        }
        if (errors.length > 0) {
            throw new HttpError(422, 'Invalid input');
        }
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

        return createdUser.toJSON();
    },

    login: async function ({ email, password }, req) {
        const user = await User.findOne({ email: email });
        if (user) {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (isPasswordCorrect) {
                const userId = user._id.toString();
                const token = jwt.sign({ email: user.email, userId: userId }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });
                return {
                    token: token,
                    userId: userId
                };
            } else {
                throw new HttpError(401, 'Password is incorrect!');
            }
        } else {
            throw new HttpError(401, `We could not find ${email} user`);
        }
    },

    createPost: async function ({ postInput: { title, content, imageUrl } }, req) {
        if (!req.isAuth) {
            throw new HttpError(401, 'User is not authenticated');
        }

        const errors = [];

        if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
            errors.push({ message: 'Title is invalid' });
        }

        if (validator.isEmpty(content) || !validator.isLength(content, { min: 5 })) {
            errors.push({ message: 'Content is invalid' });
        }
        if (errors.length > 0) {
            throw new HttpError(422, 'Invalid input');
        }

        const user = await User.findById(req.userId);

        if (!user) {
            throw new HttpError(401, 'Invalid user');
        }

        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: user
        });

        const createdPost = await post.save();
        user.posts.push(createdPost);
        await user.save();

        return createdPost.toJSON();
    }
};

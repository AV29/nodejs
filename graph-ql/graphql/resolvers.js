import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Post from '../models/post.js';
import { HttpError } from '../utils/errors.js';
import { deleteFile } from '../utils/file.js';

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
    },

    posts: async function ({ page }, req) {
        if (!req.isAuth) {
            throw new HttpError(401, 'User is not authenticated');
        }
        if (!page) {
            page = 1;
        }
        const perPage = 2;
        const totalPosts = await Post.find().countDocuments();
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .populate('creator');

        return {
            totalPosts: totalPosts,
            posts: posts.map(post => ({ ...post.toJSON(), createdAt: post.createdAt.toISOString() }))
        };
    },

    post: async function ({ id }, req) {
        if (!req.isAuth) {
            throw new HttpError(401, 'User is not authenticated');
        }

        const post = await Post.findById(id).populate('creator');
        if (!post) {
            throw new HttpError(404, 'Post was not found');
        }

        return { ...post.toJSON(), createdAt: post.createdAt.toISOString() };
    },

    updatePost: async function ({ id, postInput }, req) {
        if (!req.isAuth) {
            throw new HttpError(401, 'User is not authenticated');
        }

        const post = await Post.findById(id).populate('creator');
        if (!post) {
            throw new HttpError(404, 'Post was not found');
        }

        if (post.creator._id.toString() !== req.userId.toString()) {
            throw new HttpError(403, 'Not authorized!');
        }

        const errors = [];

        if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
            errors.push({ message: 'Title is invalid' });
        }

        if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, { min: 5 })) {
            errors.push({ message: 'Content is invalid' });
        }
        if (errors.length > 0) {
            throw new HttpError(422, 'Invalid input');
        }

        post.title = postInput.title;
        post.content = postInput.content;
        if (postInput.imageUrl !== 'undefined') {
            post.imageUrl = postInput.imageUrl;
        }

        const updatedPost = await post.save();
        return {
            ...updatedPost.toJSON(),
            createdAt: updatedPost.createdAt.toISOString(),
            updatedAt: updatedPost.updatedAt.toISOString()
        };
    },

    deletePost: async function ({ id }, req) {
        if (!req.isAuth) {
            throw new HttpError(401, 'User is not authenticated');
        }

        const post = await Post.findById(id);
        if (!post) {
            throw new HttpError(404, 'Post was not found');
        }

        if (post.creator.toString() !== req.userId.toString()) {
            throw new HttpError(403, 'Not authorized!');
        }

        await deleteFile(post.imageUrl);
        await Post.findByIdAndRemove(id);
        const user = await User.findById(req.userId);
        if (!user) {
            throw new HttpError(404, 'User was not found');
        }
        user.posts.pull(id);
        await user.save();
        return true;
    },

    user: async function (args, req) {
        if (!req.isAuth) {
            throw new HttpError(401, 'User is not authenticated');
        }
        const user = await User.findById(req.userId);
        if (!user) {
            throw new HttpError(404, 'User was not found');
        }

        return user.toJSON();
    }
};

import { validationResult } from 'express-validator';
import Post from '../models/post.js';
import { HttpError } from '../utils/errors.js';

export const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find();
        res.status(200).json({
            message: 'Posts fetched!',
            posts: posts
        });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new HttpError(422, 'Validation failed!'));
        }
        if (!req.file) {
            return next(new HttpError(422, 'No image provided!'));
        }
        const imageUrl = req.file.path;
        const title = req.body.title;
        const content = req.body.content;
        const post = new Post({
            title: title,
            content: content,
            imageUrl: imageUrl,
            creator: {
                name: 'Anton'
            }
        });
        const result = await post.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: result
        });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError(404, 'Could not find post!'));
        }

        res.status(200).json({ message: 'Post fetched!', post: post });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

import { validationResult } from 'express-validator';
import Post from '../models/post.js';
import { HttpError } from '../utils/errors.js';

export const getPosts = async (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '123',
                title: 'The first post',
                content: 'This is the first post!',
                imageUrl: 'images/Venice.jpg',
                createdAt: new Date(),
                creator: {
                    name: 'Anton'
                }
            }
        ]
    });
};

export const createPost = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return next(new HttpError(422, 'Validation failed!'));
        }
        const title = req.body.title;
        const content = req.body.content;
        const post = new Post({
            title: title,
            content: content,
            imageUrl: 'images/Venice.jpg',
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

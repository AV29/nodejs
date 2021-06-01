import { validationResult } from 'express-validator';
import Post from '../models/post.js';
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
            return res.status(422).json({ message: 'Validation failed!', errors: errors.array() });
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
        return res.status(500).json({ message: 'Something happened!'});
    }
};

import { validationResult } from 'express-validator';

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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ message: 'Validation failed!', errors: errors.array() });
    }
    const title = req.body.title;
    const content = req.body.content;
    res.status(201).json({
        message: 'Post created successfully!',
        post: {
            id: new Date().toISOString(),
            title: title,
            content: content,
            createdAt: new Date(),
            creator: {
                name: 'Anton'
            }
        }
    });
};

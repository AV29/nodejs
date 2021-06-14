import Post from '../models/post.js';
import User from '../models/user.js';
import { HttpError, handleValidationErrors } from '../utils/errors.js';
import { deleteFile } from '../utils/file.js';

export const getPosts = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const perPage = 2;
        const totalItems = await Post.countDocuments();
        const posts = await Post.find()
            .populate('creator')
            .sort({ createdAt: -1 })
            .skip((page - 1) * perPage)
            .limit(perPage);
        res.status(200).json({
            message: 'Posts fetched!',
            posts: posts,
            totalItems: totalItems
        });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const getPost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId).exec();
        if (!post) {
            return next(new HttpError(404, 'Could not find post!'));
        }

        res.status(200).json({ message: 'Post fetched!', post: post });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const createPost = async (req, res, next) => {
    try {
        handleValidationErrors(req);
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
            creator: req.userId
        });
        const savedPost = await post.save();
        const user = await User.findById(req.userId);
        if (!user) {
            return next(new HttpError(404, 'No user found!'));
        }
        user.posts.push(post);
        await user.save();
        res.status(201).json({
            message: 'Post created successfully!',
            post: savedPost,
            creator: {
                _id: user._id,
                name: user.name
            }
        });
    } catch (err) {
        console.log(err);
        if (err instanceof HttpError) {
            return next(err);
        }
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const updatePost = async (req, res, next) => {
    try {
        handleValidationErrors(req);

        const postId = req.params.postId;
        const title = req.body.title;
        const content = req.body.content;
        let imageUrl = req.body.image;
        if (req.file) {
            imageUrl = req.file.path;
        }
        if (!imageUrl) {
            return next(new HttpError(422, 'No image provided!'));
        }

        const post = await Post.findById(postId).populate('creator');
        if (!post) {
            return next(new HttpError(404, 'No post found!'));
        }
        if (post.creator._id.toString() !== req.userId) {
            return next(new HttpError(403, `Not authorized! ${req.userId} is not owner of this post`));
        }
        if (imageUrl !== post.imageUrl) {
            await deleteFile(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;

        const result = await post.save();
        res.status(201).json({
            message: 'Post updated successfully!',
            post: result
        });
    } catch (err) {
        console.log(err);
        if (err instanceof HttpError) {
            return next(err);
        }
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError(404, 'Could not find post!'));
        }
        if (post.creator.toString() !== req.userId) {
            return next(new HttpError(403, `Not authorized! ${req.userId} is not owner of this post`));
        }
        await deleteFile(post.imageUrl);
        await Post.deleteOne({ _id: postId });
        const user = await User.findById(req.userId);
        if (!user) {
            return next(new HttpError(404, 'Could not find user!'));
        }
        user.posts.pull(postId);
        await user.save();
        res.status(200).json({ message: 'Post deleted!' });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Something happened on the server!'));
    }
};

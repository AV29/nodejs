import express from 'express';
import * as controller from '../controllers/feed.js';
import { createPostValidators } from '../utils/validators.js';

const router = express.Router();

router.get('/posts', controller.getPosts);

router.get('/post/:postId', controller.getPost);

router.post('/post', createPostValidators, controller.createPost);

router.put('/post/:postId', createPostValidators, controller.updatePost);

router.delete('/post/:postId', controller.deletePost);

export default router;

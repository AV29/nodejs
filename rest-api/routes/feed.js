import express from 'express';
import * as controller from '../controllers/feed.js';
import checkAuth from '../middlewares/checkAuth.js';
import { createPostValidators } from '../utils/validators.js';

const router = express.Router();

router.get('/posts', checkAuth, controller.getPosts);

router.get('/post/:postId', checkAuth, controller.getPost);

router.post('/post', checkAuth, createPostValidators, controller.createPost);

router.put('/post/:postId', checkAuth, createPostValidators, controller.updatePost);

router.delete('/post/:postId', checkAuth, controller.deletePost);

export default router;

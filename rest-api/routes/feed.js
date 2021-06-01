import express from 'express';
import * as controller from '../controllers/feed.js';
import { createPostValidators } from '../utils/validators.js';

const router = express.Router();

router.get('/posts', controller.getPosts);

router.post('/post', createPostValidators, controller.createPost);

export default router;

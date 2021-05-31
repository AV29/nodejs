import express from 'express';
import * as controller from '../controllers/feed.js';

const router = express.Router();

router.get('/posts', controller.getPosts);

router.post('/post', controller.createPost);

export default router;

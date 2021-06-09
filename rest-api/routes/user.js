import express from 'express';
import * as controller from '../controllers/user.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/status', checkAuth, controller.getStatus);

router.patch('/status', checkAuth, controller.updateStatus);

export default router;

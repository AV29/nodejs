import express from 'express';
import * as controller from '../controllers/status.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, controller.getStatus);

export default router;

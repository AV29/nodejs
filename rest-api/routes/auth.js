import express from 'express';
import * as controller from '../controllers/auth.js';

const router = express.Router();

router.put('/signup', controller.xxx);

export default router;

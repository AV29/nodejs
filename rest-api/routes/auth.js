import express from 'express';
import * as controller from '../controllers/auth.js';
import { authValidators } from '../utils/validators.js';

const router = express.Router();

router.put('/signup', authValidators, controller.signup);

export default router;

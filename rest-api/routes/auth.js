import express from 'express';
import * as controller from '../controllers/auth.js';
import { signupValidators, loginValidators } from '../utils/validators.js';

const router = express.Router();

router.put('/signup', signupValidators, controller.signup);

router.post('/login', loginValidators, controller.login);

export default router;

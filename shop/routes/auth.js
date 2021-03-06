import express from 'express';
import * as authController from '../controllers/auth.js';
import { loginValidators, signupValidators } from '../utils/validators.js';

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', loginValidators, authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', signupValidators, authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.post('/logout', authController.postLogout);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

export default router;

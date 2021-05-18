import * as errorController from '../controllers/error.js';
import express from 'express';

const router = express.Router();

router.get('/500', errorController.get500);
router.get('/error', errorController.getError);
router.use(errorController.get404);

export default router;

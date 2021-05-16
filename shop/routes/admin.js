import express from 'express';
import * as adminController from '../controllers/admin.js';
import checkAuth from '../middlewares/checkAuth.js';
import { addProductValidators } from '../utils/validators.js';

const router = express.Router();

router.get('/add-product', checkAuth, adminController.getAddProduct);

router.get('/products', checkAuth, adminController.getProducts);

router.post('/add-product', checkAuth, addProductValidators, adminController.postAddProduct);

router.get('/edit-product/:productId', checkAuth, adminController.getEditProduct);

router.post('/edit-product', checkAuth, addProductValidators, adminController.postEditProduct);

router.post('/delete-product', checkAuth, adminController.postDeleteProduct);

export default router;

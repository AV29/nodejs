import express from 'express';
import * as adminController from '../controllers/admin.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/add-product', checkAuth, adminController.getAddProduct);

router.get('/products', checkAuth, adminController.getProducts);

router.post('/add-product', checkAuth, adminController.postAddProduct);

router.get('/edit-product/:productId', checkAuth, adminController.getEditProduct);

router.post('/edit-product', checkAuth, adminController.postEditProduct);

router.post('/delete-product', checkAuth, adminController.postDeleteProduct);

export default router;

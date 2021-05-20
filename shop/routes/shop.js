import express from 'express';
import * as shopController from '../controllers/shop.js';
import checkAuth from '../middlewares/checkAuth.js';

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', checkAuth, shopController.getCart);

router.post('/cart', checkAuth, shopController.postCart);

router.post('/cart-delete-item', checkAuth, shopController.postDeleteCartProduct);

router.post('/create-order', checkAuth, shopController.postOrder);

router.get('/orders', checkAuth, shopController.getOrders);

router.get('/orders/:orderId', checkAuth, shopController.getInvoice);

export default router;

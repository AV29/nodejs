import fs from 'node:fs/promises';
import path from 'node:path';
import Product from '../models/product.js';
import Order from '../models/order.js';
import { HttpError } from '../utils/errors.js';

export const getIndex = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/index', {
            pageTitle: 'Shop',
            products: products,
            path: '/'
        });
    } catch (err) {
        return next(new HttpError(500, 'Getting products failed!'));
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            products: products,
            path: '/products'
        });
    } catch (err) {
        return next(new HttpError(500, 'Getting products failed!'));
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/products'
        });
    } catch (err) {
        return next(new HttpError(500, 'Getting a product failed!'));
    }
};

export const getCart = async (req, res, next) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: user.cart.items
        });
    } catch (err) {
        return next(new HttpError(500, 'Getting to your cart failed!'));
    }
};

export const postCart = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        await req.user.addToCart(product);
        res.redirect('/cart');
    } catch (err) {
        return next(new HttpError(500, 'Saving your cart failed!'));
    }
};

export const postDeleteCartProduct = async (req, res, next) => {
    try {
        await req.user.removeFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (err) {
        return next(new HttpError(500, 'Deleting your cart failed!'));
    }
};

export const postOrder = async (req, res, next) => {
    try {
        const { cart } = await req.user.populate('cart.items.productId').execPopulate();
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: cart.items.map(item => ({
                quantity: item.quantity,
                product: item.productId.toJSON()
            }))
        });
        await order.save();
        await req.user.clearCart();
        res.redirect('/orders');
    } catch (err) {
        return next(new HttpError(500, 'Placing your order failed!'));
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ 'user.userId': req.session.user._id });
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders
        });
    } catch (err) {
        return next(new HttpError(500, 'Getting your orders failed!'));
    }
};

const getInvoiceByName = async invoiceName => {
    try {
        const invoicePath = path.join('data', 'invoices', invoiceName);
        return await fs.readFile(invoicePath);
    } catch (err) {
        throw new HttpError(500, 'Reading file failed!');
    }
};

export const getInvoice = async (req, res, next) => {
    try {
        const invoiceName = `invoice-${req.params.orderId}.pdf`;
        const data = await getInvoiceByName(invoiceName);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${invoiceName}"`);
        res.send(data);
    } catch (err) {
        if (err instanceof HttpError) {
            return next(err);
        }
        return next(new HttpError(500, 'Getting your invoice failed!'));
    }
};

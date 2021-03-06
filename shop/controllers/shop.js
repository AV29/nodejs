import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';
import Stripe from 'stripe';
import Product from '../models/product.js';
import Order from '../models/order.js';
import { HttpError } from '../utils/errors.js';
import { ITEMS_PER_PAGE } from '../utils/constants.js';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const getIndex = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const numberProducts = await Product.countDocuments();
        const products = await Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        res.render('shop/index', {
            pageTitle: 'Shop',
            products: products,
            hasNextPage: ITEMS_PER_PAGE * page < numberProducts,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(numberProducts / ITEMS_PER_PAGE),
            currentPage: page,
            path: '/'
        });
    } catch (err) {
        return next(new HttpError(500, 'Getting products failed!'));
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const numberProducts = await Product.countDocuments();
        const products = await Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            products: products,
            path: '/products',
            hasNextPage: ITEMS_PER_PAGE * page < numberProducts,
            hasPrevPage: page > 1,
            nextPage: page + 1,
            prevPage: page - 1,
            lastPage: Math.ceil(numberProducts / ITEMS_PER_PAGE),
            currentPage: page
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

export const getInvoice = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId);
        if (!order) {
            return next(new HttpError(404, 'No order found!'));
        }
        if (order.user.userId.toString() !== req.user._id.toString()) {
            return next(new HttpError(403, 'You are not authorized to view this invoice!'));
        }
        const invoiceName = `invoice-${orderId}.pdf`;
        const invoicePath = path.join('data', 'invoices', invoiceName);

        const pdf = new PDFDocument();
        pdf.pipe(fs.createWriteStream(invoicePath));
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
        pdf.pipe(res);

        pdf.fontSize(26).text('Invoice', { underline: true });
        pdf.text('------------------------------');
        let totalPrice = 0;
        pdf.fontSize(14);
        order.products.forEach(prod => {
            pdf.text(`${prod.product.title}-${prod.quantity} x $${prod.product.price}`);
            totalPrice += prod.quantity * prod.product.price;
        });
        pdf.text('------------------------------');
        pdf.fontSize(20).text(`Total Price: ${totalPrice}`);
        pdf.end();
    } catch (err) {
        return next(new HttpError(500, 'Getting your invoice failed!'));
    }
};

export const getCheckout = async (req, res, next) => {
    try {
        const {
            cart: { items }
        } = await req.user.populate('cart.items.productId').execPopulate();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(({ productId, quantity }) => ({
                name: productId.title,
                description: productId.description,
                amount: productId.price * 100,
                currency: 'usd',
                quantity: quantity
            })),
            success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
        });

        res.render('shop/checkout', {
            pageTitle: 'Checkout',
            path: '/checkout',
            totalSum: items.reduce((total, item) => total + item.productId.price * item.quantity, 0),
            products: items,
            sessionId: session.id
        });
    } catch (err) {
        console.log(err);
        return next(new HttpError(500, 'Getting to your checkout page failed!'));
    }
};
export const getCheckoutSuccess = async (req, res, next) => {
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

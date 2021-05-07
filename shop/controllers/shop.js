import Product from '../models/product.js';
import Order from '../models/order.js';

export const getIndex = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shop/index', {
            pageTitle: 'Shop',
            products: products,
            path: '/'
        });
    } catch (err) {
        console.error(err);
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('shop/product-list', {
            pageTitle: 'All Products',
            products: products,
            path: '/products'
        });
    } catch (err) {
        console.error(err);
    }
};

export const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        res.render('shop/product-detail', {
            pageTitle: product.title,
            product: product,
            path: '/products'
        });
    } catch (err) {
        console.error(err);
    }
};

export const getCart = async (req, res) => {
    try {
        const user = await req.user.populate('cart.items.productId').execPopulate();
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: user.cart.items
        });
    } catch (err) {
        console.error(err);
    }
};

export const postCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        await req.user.addToCart(product);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

export const postDeleteCartProduct = async (req, res, next) => {
    try {
        await req.user.removeFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

export const postOrder = async (req, res) => {
    try {
        const { cart } = await req.user.populate('cart.items.productId').execPopulate();
        const order = new Order({
            user: {
                name: req.user.name,
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
        console.error(err);
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ 'user.userId': req.user._id });
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders
        });
    } catch (err) {
        console.error(err);
    }
};

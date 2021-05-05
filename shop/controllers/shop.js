const Product = require('../models/product');

exports.getIndex = async (req, res) => {
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

exports.getProducts = async (req, res) => {
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

exports.getProduct = async (req, res) => {
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

exports.getCart = async (req, res) => {
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

exports.postCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        await req.user.addToCart(product);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

exports.postDeleteCartProduct = async (req, res, next) => {
    try {
        await req.user.deleteItemFromCart(req.body.productId);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

exports.postOrder = async (req, res) => {
    try {
        await req.user.addOrder();
        res.redirect('/orders');
    } catch (err) {
        console.error(err);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await req.user.getOrders();
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders
        });
    } catch (err) {
        console.error(err);
    }
};

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = async (req, res) => {
    try {
        const products = await Product.findAll();
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
        const products = await Product.findAll();
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
        const product = await Product.findByPk(req.params.productId);
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
        const cart = await Cart.getCart();
        const products = await Product.findAll();
        const cartProducts = [];
        for (const product of products) {
            const cartProduct = cart.products.find(prod => prod.id === product.id);
            if (cartProduct) {
                cartProducts.push({ data: product, qty: cartProduct.qty });
            }
        }
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: cartProducts
        });
    } catch (err) {
        console.error(err);
    }
};

exports.postCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findByPk(productId);
        await Cart.addProduct(productId, product.price);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

exports.postDeleteCartProduct = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const product = await Product.findByPk(productId);
        await Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

exports.getOrders = async (req, res) => {
    res.render('shop/orders', {
        pageTitle: 'Orders',
        path: '/orders'
    });
};

exports.getCheckout = async (req, res) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

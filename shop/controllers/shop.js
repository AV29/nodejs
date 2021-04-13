const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = async (req, res) => {
    const products = await Product.fetchAll();
    res.render('shop/index', {
        pageTitle: 'Shop',
        products: products,
        path: '/'
    });
};

exports.getProducts = async (req, res) => {
    const products = await Product.fetchAll();
    res.render('shop/product-list', {
        pageTitle: 'All Products',
        products: products,
        path: '/products'
    });
};

exports.getProduct = async (req, res) => {
    const product = await Product.findById(req.params.productId);
    res.render('shop/product-detail', {
        pageTitle: product.title,
        product: product,
        path: '/products'
    });
};

exports.getCart = async (req, res) => {
    const cart = await Cart.getCart();
    const products = await Product.fetchAll();
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
};

exports.postCart = async (req, res) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    await Cart.addProduct(productId, product.price);
    res.redirect('/cart');
};

exports.postDeleteCartProduct = async (req, res, next) => {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    await Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
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

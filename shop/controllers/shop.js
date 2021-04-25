const Product = require('../models/product');
//const Order = require('../models/order');

exports.getIndex = async (req, res) => {
    try {
        const products = await Product.fetchAll();
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
        const products = await Product.fetchAll();
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
        const cart = await req.user.getCart();
        const products = await cart.getProducts();
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: products
        });
    } catch (err) {
        console.error(err);
    }
};

exports.postCart = async (req, res) => {
    try {
        const productId = req.body.productId;
        const cart = await req.user.getCart();
        const [product] = await cart.getProducts({ where: { id: productId } });
        const tableProduct = await Product.findByPk(productId);
        await cart.addProduct(tableProduct, { through: { quantity: product ? product.cartItem.quantity + 1 : 1 } });
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

exports.postDeleteCartProduct = async (req, res, next) => {
    try {
        const productId = req.body.productId;
        const cart = await req.user.getCart();
        const [product] = await cart.getProducts({ where: { id: productId } });
        await product.cartItem.destroy();
        res.redirect('/cart');
    } catch (err) {
        console.error(err);
    }
};

exports.postOrders = async (req, res) => {
    try {
        const cart = await req.user.getCart();
        const order = await req.user.createOrder();
        const products = await cart.getProducts();
        await order.addProducts(
            products.map(prod => {
                prod.orderItem = { quantity: prod.cartItem.quantity };
                return prod;
            })
        );
        await cart.setProducts(null);
        res.redirect('/orders');
    } catch (err) {
        console.error(err);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await req.user.getOrders({ include: ['products'] });
        res.render('shop/orders', {
            pageTitle: 'Orders',
            path: '/orders',
            orders: orders
        });
    } catch (err) {
        console.error(err);
    }
};

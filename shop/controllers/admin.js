const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        isEditing: false,
        product: {
            title: '',
            price: 0,
            imageUrl: '',
            description: ''
        }
    });
};

exports.postAddProduct = async (req, res, next) => {
    const { title, description, imageUrl, price } = req.body;
    try {
        const product = new Product(title, price, description, imageUrl, null, req.user._id);
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.fetchAll();
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            products: products,
            path: '/admin/products'
        });
    } catch (err) {
        console.error(err);
    }
};

exports.postEditProduct = async (req, res, next) => {
    try {
        const { productId, title, description, price, imageUrl } = req.body;
        const product = new Product(title, price, description, imageUrl, productId);
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

exports.getEditProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).render('404', {
                pageTitle: 'Page Not Found',
                path: '/',
                errorMessage: `There is no product with ID: ${req.params.productId}!`
            });
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            isEditing: true,
            product: product
        });
    } catch (err) {
        console.error(err);
    }
};

exports.postDeleteProduct = async (req, res, next) => {
    try {
        await Product.deleteById(req.body.productId);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

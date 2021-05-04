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
        const product = new Product({
            title: title,
            description: description,
            imageUrl: imageUrl,
            price: price,
            userId: req.user
        });
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
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
        const product = await Product.findById(req.body.productId);
        product.title = req.body.title;
        product.description = req.body.description;
        product.price = req.body.price;
        product.imageUrl = req.body.imageUrl;
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
        await Product.deleteById(req.body.productId, req.user);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

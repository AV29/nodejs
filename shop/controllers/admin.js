const Product = require('../models/product');

module.exports.getAddProduct = (req, res, next) => {
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

module.exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('admin/products', {
        pageTitle: 'Admin Products',
        products: products,
        path: 'admin/products'
    });
};

module.exports.postEditProduct = async (req, res, next) => {
    const { productId, title, description, price, imageUrl } = req.body;
    const updatedProduct = new Product(productId, title, imageUrl, description, price);
    await updatedProduct.save();
    res.redirect('/admin/products');
};

module.exports.postDeleteProduct = async (req, res, next) => {
    const { productId } = req.body;
    await Product.deleteById(productId);
    res.redirect('/admin/products');
};

module.exports.getEditProduct = async (req, res, next) => {
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
};

module.exports.postAddProduct = (req, res, next) => {
    const { title, description, imageUrl, price } = req.body;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/');
};

import Product from '../models/product.js';

export const getAddProduct = async (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        isEditing: false,
        isAuthenticated: req.session.isAuthenticated,
        product: {
            title: '',
            price: 0,
            imageUrl: '',
            description: ''
        }
    });
};

export const postAddProduct = async (req, res, next) => {
    const { title, description, imageUrl, price } = req.body;
    try {
        const product = new Product({
            title: title,
            description: description,
            imageUrl: imageUrl,
            price: price,
            userId: req.session.user
        });
        await product.save();
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

export const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();
        // .select('title price imageUrl')
        // .populate('userId', 'name');
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            products: products,
            isAuthenticated: req.session.isAuthenticated,
            path: '/admin/products'
        });
    } catch (err) {
        console.error(err);
    }
};

export const postEditProduct = async (req, res, next) => {
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

export const getEditProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).render('404', {
                pageTitle: 'Page Not Found',
                path: '/',
                isAuthenticated: req.session.isAuthenticated,
                errorMessage: `There is no product with ID: ${req.params.productId}!`
            });
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            isEditing: true,
            isAuthenticated: req.session.isAuthenticated,
            product: product
        });
    } catch (err) {
        console.error(err);
    }
};

export const postDeleteProduct = async (req, res, next) => {
    try {
        await Product.deleteOne({ _id: req.body.productId });
        await req.session.user.removeFromCart(req.body.productId);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

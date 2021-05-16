import Product from '../models/product.js';
import { validationResult } from 'express-validator';

export const getAddProduct = async (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        isEditing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Add Product',
                path: '/admin/add-product',
                isEditing: false,
                hasError: true,
                validationErrors: errors.array(),
                errorMessage: errors.array()[0].msg,
                product: {
                    title: title,
                    price: price,
                    imageUrl: imageUrl,
                    description: description
                }
            });
        }
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
        const products = await Product.find({ userId: req.user._id });
        // .select('title price imageUrl')
        // .populate('userId', 'name');
        res.render('admin/products', {
            pageTitle: 'Admin Products',
            products: products,
            path: '/admin/products'
        });
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
                errorMessage: `There is no product with ID: ${req.params.productId}!`
            });
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            isEditing: true,
            hasError: false,
            errorMessage: null,
            product: product,
            validationErrors: []
        });
    } catch (err) {
        console.error(err);
    }
};

export const postEditProduct = async (req, res, next) => {
    try {
        const { title, description, price, imageUrl, productId } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                isEditing: true,
                hasError: true,
                validationErrors: errors.array(),
                errorMessage: errors.array()[0].msg,
                product: {
                    _id: productId,
                    title: title,
                    price: price,
                    imageUrl: imageUrl,
                    description: description
                }
            });
        }
        const product = await Product.findById(req.body.productId);
        if (product.userId.toString() !== req.user._id.toString()) {
            res.redirect('/');
        } else {
            product.title = title;
            product.description = description;
            product.price = price;
            product.imageUrl = imageUrl;
            await product.save();
            res.redirect('/admin/products');
        }
    } catch (err) {
        console.error(err);
    }
};

export const postDeleteProduct = async (req, res, next) => {
    try {
        await Product.deleteOne({ _id: req.body.productId, userId: req.user._id });
        await req.user.removeFromCart(req.body.productId);
        res.redirect('/admin/products');
    } catch (err) {
        console.error(err);
    }
};

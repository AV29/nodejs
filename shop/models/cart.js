const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const getPathToProducts = () => path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(getPathToProducts(), (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            const existingProductIndex = cart.products.findIndex(product => product.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty += 1;
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice += parseInt(productPrice);
            fs.writeFile(getPathToProducts(), JSON.stringify(cart), err => {
                console.error(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(getPathToProducts(), (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice -= product.qnty * productPrice;
            fs.writeFile(getPathToProducts(), JSON.stringify(updatedCart), err => {
                console.error(err);
            });
        });
    }
};

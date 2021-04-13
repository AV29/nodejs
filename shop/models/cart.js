const fs = require('fs').promises;
const path = require('path');
const rootDir = require('../utils/path');
const pathToCart = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
    static async addProduct(id, productPrice) {
        return new Promise(async resolve => {
            let cart = {};
            try {
                const fileContent = await fs.readFile(pathToCart);
                cart = JSON.parse(fileContent);
            } catch (err) {
                cart = { products: [], totalPrice: 0 };
            } finally {
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
                await fs.writeFile(pathToCart, JSON.stringify(cart));
                resolve(cart);
            }
        });
    }

    static async deleteProduct(id, productPrice) {
        return new Promise(async (resolve, reject) => {
            try {
                const fileContent = await fs.readFile(pathToCart);
                const updatedCart = { ...JSON.parse(fileContent) };
                const product = updatedCart.products.find(prod => prod.id === id);
                updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
                updatedCart.totalPrice -= product.qnty * productPrice;
                await fs.writeFile(pathToCart, JSON.stringify(updatedCart));
                resolve(id);
            } catch (err) {
                reject(err);
            }
        });
    }

    static async getCart() {
        return new Promise(async resolve => {
            try {
                const cart = await fs.readFile(pathToCart);
                resolve(JSON.parse(cart));
            } catch (err) {
                resolve(null);
            }
        });
    }
};

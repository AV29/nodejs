const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const Cart = require('./cart');

const getPathToProducts = () => path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = () =>
    new Promise(resolve => {
        fs.readFile(getPathToProducts(), (err, fileContent) => {
            resolve(err ? [] : JSON.parse(fileContent));
        });
    });

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.price = price;
    }

    async save() {
        const products = await getProductsFromFile();

        if (this.id) {
            const existingProductIndex = products.findIndex(prod => prod.id === this.id);
            const updatedProducts = [...products];
            updatedProducts[existingProductIndex] = this;
            fs.writeFile(getPathToProducts(), JSON.stringify(updatedProducts), err => {
                if (err) console.log(err);
            });
        } else {
            this.id = Math.random().toString();
            products.push(this);
            fs.writeFile(getPathToProducts(), JSON.stringify(products), err => {
                if (err) console.log(err);
            });
        }
    }

    static fetchAll() {
        return getProductsFromFile();
    }

    static async findById(id) {
        const products = await Product.fetchAll();
        return products.find(product => product.id === id);
    }

    static async deleteById(id) {
        const products = await Product.fetchAll();
        const product = products.find(prod => prod.id === id);
        const updatedProducts = products.filter(product => product.id !== id);
        fs.writeFile(getPathToProducts(), JSON.stringify(updatedProducts), err => {
            if (!err) {
                Cart.deleteProduct(id, product.price);
            }
        });
    }
};

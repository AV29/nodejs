const fs = require('fs').promises;
const path = require('path');
const rootDir = require('../utils/path');
const Cart = require('./cart');
const pathToProducts = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = async () => {
    try {
        const fileContent = await fs.readFile(pathToProducts);
        return JSON.parse(fileContent);
    } catch (err) {
        return [];
    }
};

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
            try {
                await fs.writeFile(pathToProducts, JSON.stringify(updatedProducts));
            } catch (err) {
                console.error(err);
            }
        } else {
            this.id = Math.random().toString();
            products.push(this);
            try {
                await fs.writeFile(pathToProducts, JSON.stringify(products));
            } catch (err) {
                console.error(err);
            }
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
        try {
            await fs.writeFile(pathToProducts, JSON.stringify(updatedProducts));
            await Cart.deleteProduct(id, product.price);
            return id;
        } catch (err) {
            throw err;
        }
    }
};

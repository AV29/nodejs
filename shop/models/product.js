const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/path");

const getPathToProducts = () => path.join(rootDir, "data", "products.json");

const getProductsFromFile = () =>
  new Promise((resolve) => {
    fs.readFile(getPathToProducts(), (err, fileContent) => {
      resolve(err ? [] : JSON.parse(fileContent));
    });
  });

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.description = description;
    this.imageUrl = imageUrl;
    this.price = price;
  }

  async save() {
    const products = await getProductsFromFile();
    products.push(this);
    fs.writeFile(getPathToProducts(), JSON.stringify(products), (err) => {
      if (err) console.log(err);
    });
  }

  static fetchAll() {
    return getProductsFromFile();
  }
};

const fs = require("fs");
const path = require("path");
const rootDir = require("../utils/path");

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const pathToProducts = path.join(rootDir, "data", "products.json");
    fs.readFile(pathToProducts, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(pathToProducts, JSON.stringify(products), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static fetchAll() {
    const pathToProducts = path.join(rootDir, "data", "products.json");
    return new Promise(resolve => {
      fs.readFile(pathToProducts, (err, fileContent) => {
        if (err) {
          console.log(err);
          resolve([]);
        }
        resolve(JSON.parse(fileContent));
      });
    });
  }
};

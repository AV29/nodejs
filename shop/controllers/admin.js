const Product = require("../models/product");

module.exports.getAddProduct = (req, res) => {
  res.render("admin/add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

module.exports.getProducts = async (req, res) => {
  const products = await Product.fetchAll();
  res.render("admin/products", {
    pageTitle: "Admin Products",
    products: products,
    path: "admin/products",
  });
};

module.exports.postAddProduct = (req, res, next) => {
  const { title, description, imageUrl, price } = req.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  res.redirect("/");
};

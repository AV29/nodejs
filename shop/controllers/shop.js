const Product = require("../models/product");

module.exports.getIndex = async (req, res) => {
  const products = await Product.fetchAll();
  res.render("shop/index", {
    pageTitle: "Shop",
    products: products,
    path: "/",
  });
};

module.exports.getProducts = async (req, res) => {
  const products = await Product.fetchAll();
  res.render("shop/product-list", {
    pageTitle: "All Products",
    products: products,
    path: "/products",
  });
};

module.exports.getCart = async (req, res) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

module.exports.getCheckout = async (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

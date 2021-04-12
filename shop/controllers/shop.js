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

module.exports.getProduct = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  res.render("shop/product-detail", {
    pageTitle: product.title,
    product: product,
    path: "/products",
  });
};

module.exports.getCart = async (req, res) => {
  res.render("shop/cart", {
    pageTitle: "Your Cart",
    path: "/cart",
  });
};

module.exports.postCart = async (req, res) => {
  const productId = req.body.productId;
  console.log(productId);
  res.redirect('/cart');
};

module.exports.getOrders = async (req, res) => {
  res.render("shop/orders", {
    pageTitle: "Orders",
    path: "/orders",
  });
};

module.exports.getCheckout = async (req, res) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};

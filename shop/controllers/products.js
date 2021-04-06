const products = [];

module.exports.getAddProduct = (req, res) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
};

module.exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

module.exports.getProducts = (req, res) => {
  res.render("shop", {
    pageTitle: "Shop",
    products: products,
    path: "/",
  });
};

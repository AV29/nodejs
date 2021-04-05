const express = require("express");
const products = require("./admin").products;
const router = express.Router();

router.get("/", (req, res) => {
  res.render("shop", {
    pageTitle: "Shop",
    products: products,
    hasProducts: products.length > 0,
    path: "/",
  });
});

module.exports = router;

const express = require("express");
const path = require("path");
const rootDir = require("../utils/path");
const products = require("./admin").products;
const router = express.Router();

router.get("/", (req, res) => {
  console.log(products);
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;

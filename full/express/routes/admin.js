const express = require("express");
const router = express.Router();

router.get("/add-product", (req, res) => {
  res.send(
    '<form action="/product" method="post"><input type="text" name="product"><button type="submit">Add</button></form>'
  );
});

router.post("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/add-product");
});

module.exports = router;

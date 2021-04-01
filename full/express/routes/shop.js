const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("<h1>Hello from NodeJS</h1>");
});

module.exports = router;

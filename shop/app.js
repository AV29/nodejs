const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin").routes;
const shopRoutes = require("./routes/shop");

const app = express();
app.set('view engine', 'pug');
app.set('views', 'views');
app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "not-found.html"));
});

app.listen(3000);

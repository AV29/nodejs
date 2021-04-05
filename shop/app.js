const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const rootDir = require("./utils/path");
const adminRoutes = require("./routes/admin").routes;
const shopRoutes = require("./routes/shop");
const initHbs = require("express-handlebars");

const app = express();

app.engine('.hbs', initHbs({
  extname: '.hbs',
  defaultLayout: null
}));
app.set("view engine", "hbs");
app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

app.listen(3000);

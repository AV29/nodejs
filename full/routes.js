const users = ["Anton", "Ksu"];
const getHtml = require("./getHtml");

module.exports = (req, res) => {
  const { url, method } = req;

  if (url === "/") {
    getHtml(
      res,
      "<body><form method='POST' action='/create-user'><input type='text' name='username'><input type='submit'></form></body>"
    );
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const data = [];
    req.on("data", (chunk) => {
      data.push(chunk);
    });
    return req.on("end", () => {
      const parsedMessage = Buffer.concat(data).toString();
      users.push(parsedMessage.split("=")[1]);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }

  if (url === "/users") {
    const body = users.reduce((res, curr) => res + `<li>${curr}</li>`, "");
    getHtml(res, `<body><ul>${body}</ul></body>`);
    return res.end();
  }

  res.setHeader("Content-Type", "text/html");
  getHtml(res, "<h1>Not found</h1>");
  res.end();
};

module.exports = (res, body) => {
    res.write("<html lang='en'>");
    res.write("<head><title>Simple NodeJS server</title></head>");
    res.write(body);
    res.write("</html>");
};
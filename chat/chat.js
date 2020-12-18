let clients = [];

module.exports.subscribe = function(req, res) {
    console.log("subscribe");

    clients.push(res);

    res.on('close', function() {
        clients.splice(clients.indexOf(res), 1);
    });
};

module.exports.publish = function(message) {
    console.log("publish %s", message);

    clients.forEach(function(res) {
        res.end(message);
    });

    clients = [];
};
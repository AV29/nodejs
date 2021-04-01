const numberOfVisits = function(req, res, next) {
    req.session.numberOfVisits = req.session.numberOfVisits + 1 || 1;
    next();
};

module.exports = numberOfVisits;

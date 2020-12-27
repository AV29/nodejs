const express = require('express');
const HttpError = require('../error').HttpError;
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();

/* GET users listing. */
const User = require('../models/User').User;
router.get('/', function(req, res, next) {
  User.find({})
      .then(users => { res.json(users) })
      .catch(err => next(err));
});

router.get('/:id', function(req, res, next) {
  try {
      const id = new ObjectID(req.params.id);
  }
  catch (err) {
    return next(404);
  }
  User.findById(req.params.id)
      .then(user => {
          if(!user) next(new HttpError(404, 'User not found!'));
          else res.json(user);
      })
      .catch(err => next(err));
});

module.exports = router;

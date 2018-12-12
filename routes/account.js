var express = require('express');
var router = express.Router();
var isAuthenticated = require('../middlewares/isAuthenticated.js');
var User = require('../models/users.js')

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.post('/signup', function (req, res, next) {
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;
  var u = new User({ name: name, username: username, password: password, group: null})
  User.findOne({username: username}, function (err, result){
    if (err) next (err)
    if (result != null) {
      next(new Error('username taken -- try another one'))
    } else {
      u.save(function (err, result) { 
        if (err) {
          next(err)
        }
        if (!err) {
          res.redirect('/account/login')
        }
      })
    }
  });
})

router.get('/login', function (req, res) {
  res.render('login')
})

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username, password: password }, function (err, result) { 
    if (!err && result != null) {
      req.session.user = username;
      req.session.group = result.group;
      res.redirect('/groups')
    } else {
      next(new Error('invalid credentials'))
    }
  })
})

router.get('/logout', isAuthenticated, function (req, res) {
  req.session.user = '';
  res.redirect('/')
})
module.exports = router;

const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/database');

module.exports = function (app, passport) {
  app.get('/', function (req, res) {
    res.json('Welcome to my Node.js Auth app');
  });

  app.post('/signup', function (req, res) {
    const newUser = new User({ email: req.body.email, password: req.body.password });
    User.createUser(newUser, function (err) {
      if (err) res.json({ success: false, message: 'User not registered' });
      else res.json({ success: true, message: 'User is registered' });
    });
  });

  app.post('/login', function (req, res) {
    const { email, password } = req.body;
    User.getUserByEmail(email, function (err, user) {
      if (err) throw err;
      if (!user) return res.json({ success: false, message: 'User not found' });
      User.comparePasswords(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign(
            { id: user._id, email: user.email, password: user.password },
            config.secret,
            { expiresIn: 600000 }
          );
          res.json({
            token: 'bearer ' + token,
            success: true,
            user: { id: user._id, email: user.email, password: user.password },
          })
        } else res.json('Passwords doesn\'t match');
      });
    });
  });

  app.get('/profile', passport.authenticate('jwt', { session: false }), function (req, res) {
    res.json({ user: req.user });
  });

  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  })
};

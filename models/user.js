const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function (id, cb) {
  User.findById(id, cb);
};

module.exports.getUserByEmail = function (email, cb) {
  User.findOne({ email }, cb);
};

module.exports.createUser = function (newUser, cb) {
  bcrypt.getSalt(10, function (err, salt) {
    bcrypt.hash(newUser.password, salt, function (err, hash) {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(cb);
    });
  })
};

module.exports.comparePasswords = function (myPassword, hash, cb) {
  bcrypt.compare(myPassword, hash, function (err, isMatch) {
    if (err) throw err;
    cb(null, isMatch);

  })
};

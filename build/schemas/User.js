"use strict";

var mongoose = require('mongoose');

var bcrypt = require('bcryptjs'); // 비밀번호 보안 강화 모듈


var UsersSchema = mongoose.Schema({
  username: String,
  password: String,
  created: {
    type: Date,
    "default": Date.now
  }
});

UsersSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, 8);
};

UsersSchema.methods.validateHash = function (password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UsersSchema);
module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // 비밀번호 보안 강화 모듈

const UsersSchema = mongoose.Schema({
  username: String,
  password: String,
  created: { type: Date, default: Date.now },
});

UsersSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, 8);
};

UsersSchema.methods.validateHash = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UsersSchema);
module.exports = User;

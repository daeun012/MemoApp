import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // 비밀번호 보안 강화 모듈

const Schema = mongoose.Schema;

const Account = new Schema({
  username: String,
  password: String,
  created: { type: Date, default: Date.now },
});

Account.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, 8);
};

Account.methods.validateHash = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('account', Account);

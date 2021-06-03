"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 비밀번호 보안 강화 모듈
var Schema = _mongoose["default"].Schema;
var Account = new Schema({
  username: String,
  password: String,
  created: {
    type: Date,
    "default": Date.now
  }
});

Account.methods.generateHash = function (password) {
  return _bcryptjs["default"].hashSync(password, 8);
};

Account.methods.validateHash = function (password) {
  return _bcryptjs["default"].compareSync(password, this.password);
};

var _default = _mongoose["default"].model('account', Account);

exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _account = _interopRequireDefault(require("../models/account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.post('/signup', function (req, res) {
  // Check username format
  var usernameRegex = /^[a-z0-9]+$/;

  if (!usernameRegex.test(req.body.username)) {
    return res.status(400).json({
      error: 'BAD USERNAME',
      code: 1
    });
  } // Check pass length


  if (req.body.password.length < 4 || typeof req.body.password !== 'string') {
    return res.status(400).json({
      error: 'BAD PASSWORD',
      code: 2
    });
  } // Check user existance


  _account["default"].findOne({
    username: req.body.username
  }, function (err, exists) {
    if (err) throw err;

    if (exists) {
      return res.status(409).json({
        error: 'USERNAME EXISTS',
        code: 3
      });
    }

    var account = new _account["default"]({
      username: req.body.username,
      password: req.body.password
    });
    console.log(account);
    account.password = account.generateHash(account.password);
    console.log(account.password);
    account.save(function (err) {
      if (err) throw err;
      return res.json({
        success: true
      });
    });
  });
});
router.post('/signin', function (req, res) {
  if (typeof req.body.password !== 'string') {
    return res.status(401).json({
      error: 'LOGIN FAILED',
      code: 1
    });
  } // Find the user by username


  _account["default"].findOne({
    username: req.body.username
  }, function (err, account) {
    if (err) throw err; // Check account existancy

    if (!account) {
      return res.status(401).json({
        error: 'LOGIN FAILED',
        code: 1
      });
    } // Chekc wheter the password is valid


    if (!account.validateHash(req.body.password)) {
      return res.status(401).json({
        error: 'LOGIN FAILED',
        code: 1
      });
    } // Alter session


    var session = req.session;
    console.log(session);
    session.loginInfo = {
      _id: account._id,
      username: account.username
    }; // Retrun success

    return res.json({
      success: true
    });
  });
});
router.get('/getinfo', function (req, res) {
  if (typeof req.session.loginInfo == 'undefined') {
    return res.status(401).json({
      error: 1
    });
  }

  res.json({
    info: req.session.loginInfo
  });
});
router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  return res.json({
    sucess: true
  });
});
var _default = router;
exports["default"] = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _memo = _interopRequireDefault(require("../models/memo"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router(); // WRITE MEMO


router.post('/', function (req, res) {
  // check login status
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 1
    });
  } // check contents valid


  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }

  if (req.body.contents === '') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  } // create new memo


  var memo = new _memo["default"]({
    writer: req.session.loginInfo.username,
    contents: req.body.contents
  }); // save in database

  memo.save(function (err) {
    if (err) throw err;
    return res.json({
      success: true
    });
  });
}); // MODIFY MEMO

router.put('/:id', function (req, res) {
  // check memo id validity
  if (!_mongoose["default"].Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'INVALID ID',
      code: 1
    });
  } // check contents valid


  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  }

  if (req.body.contents === '') {
    return res.status(400).json({
      error: 'EMPTY CONTENTS',
      code: 2
    });
  } // check login status


  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 3
    });
  } // find memo


  _memo["default"].findById(req.params.id, function (err, memo) {
    if (err) throw err; // if memo does not exist

    if (!memo) {
      return res.status(404).json({
        error: 'NO RESOURCE',
        code: 4
      });
    } // if exists, check writer


    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: 'PERMISSION FAILURE',
        code: 5
      });
    } // modify and save in database


    memo.contents = req.body.contents;
    memo.date.edited = new Date();
    memo.is_edited = true;
    memo.save(function (err, memo) {
      if (err) throw err;
      return res.json({
        success: true,
        memo: memo
      });
    });
  });
}); // DELETE MEMO

router["delete"]('/:id', function (req, res) {
  //check memo id validity
  if (!_mongoose["default"].Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: 'INBALID ID',
      code: 1
    });
  } // check login status


  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: 'NOT LOGGED IN',
      code: 2
    });
  } // find memo and check for wirter


  _memo["default"].findById(req.params.id, function (err, memo) {
    if (err) throw err;

    if (!memo) {
      return res.status(404).json({
        error: 'NO RESOURCE',
        code: 3
      });
    }

    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: 'PERMISSION FAILURE',
        code: 4
      });
    } // remove the memo


    _memo["default"].remove({
      _id: req.params.id
    }, function (err) {
      if (err) throw err;
      res.json({
        success: true
      });
    });
  });
}); // GET MEMO LIST

router.get('/', function (req, res) {
  _memo["default"].find().sort({
    _id: -1
  }).limit(6).exec(function (err, memos) {
    if (err) throw err;
    res.json(memos);
  });
});
var _default = router;
exports["default"] = _default;
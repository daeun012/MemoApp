"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Memo = require('../schemas/Memo');

module.exports = {
  write: function write(req, res) {
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


    var memo = new Memo({
      writer: req.session.loginInfo.username,
      contents: req.body.contents
    }); // save in database

    memo.save(function (err) {
      if (err) throw err;
      return res.json({
        success: true
      });
    });
  },
  read: function read(req, res) {
    Memo.find().sort({
      _id: -1
    }).limit(6).exec(function (err, memos) {
      if (err) throw err;
      res.json(memos);
    });
  },
  getList: function getList(req, res) {
    var listType = req.params.listType;
    var id = req.params.id;

    if (listType !== 'old' && listType !== 'new') {
      // CHECK LIST TYPE VALIDITY
      return res.status(400).json({
        error: 'INVALID LISTTYPE',
        code: 1
      });
    } // CHECK MEMO ID VALIDITY


    if (!_mongoose["default"].Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'INVALID ID',
        code: 2
      });
    }

    var objId = new _mongoose["default"].Types.ObjectId(req.params.id);

    if (listType === 'new') {
      // GET NEWER MEMO
      Memo.find({
        _id: {
          $gt: objId
        }
      }).sort({
        _id: -1
      }).limit(6).exec(function (err, memos) {
        if (err) throw err;
        return res.json(memos);
      });
    } else {
      // GET OLDER MEMO
      Memo.find({
        _id: {
          $lt: objId
        }
      }).sort({
        _id: -1
      }).limit(6).exec(function (err, memos) {
        if (err) throw err;
        return res.json(memos);
      });
    }
  },
  modify: function modify(req, res) {
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


    Memo.findById(req.params.id, function (err, memo) {
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
  },
  "delete": function _delete(req, res) {
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


    Memo.findById(req.params.id, function (err, memo) {
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


      Memo.remove({
        _id: req.params.id
      }, function (err) {
        if (err) throw err;
        res.json({
          success: true
        });
      });
    });
  }
};
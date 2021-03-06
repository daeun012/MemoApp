const Memo = require('../schemas/Memo');
import mongoose from 'mongoose';

module.exports = {
  write: (req, res) => {
    // check login status
    if (typeof req.session.loginInfo === 'undefined') {
      return res.status(403).json({
        error: 'NOT LOGGED IN',
        code: 1,
      });
    }

    // check contents valid
    if (typeof req.body.contents !== 'string') {
      return res.status(400).json({
        error: 'EMPTY CONTENTS',
        code: 2,
      });
    }

    if (req.body.contents === '') {
      return res.status(400).json({
        error: 'EMPTY CONTENTS',
        code: 2,
      });
    }

    // create new memo
    let memo = new Memo({
      writer: req.session.loginInfo.username,
      contents: req.body.contents,
    });

    // save in database
    memo.save((err) => {
      if (err) throw err;
      return res.json({ success: true });
    });
  },

  read: (req, res) => {
    Memo.find()
      .sort({ _id: -1 })
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        res.json(memos);
      });
  },

  readList: (req, res) => {
    let listType = req.params.listType;
    let id = req.params.id;

    if (listType !== 'old' && listType !== 'new') {
      // CHECK LIST TYPE VALIDITY
      return res.status(400).json({
        error: 'INVALID LISTTYPE',
        code: 1,
      });
    }

    // CHECK MEMO ID VALIDITY
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'INVALID ID',
        code: 2,
      });
    }

    let objId = new mongoose.Types.ObjectId(req.params.id);

    if (listType === 'new') {
      // GET NEWER MEMO
      Memo.find({ _id: { $gt: objId } })
        .sort({ _id: -1 })
        .limit(6)
        .exec((err, memos) => {
          if (err) throw err;
          return res.json(memos);
        });
    } else {
      // GET OLDER MEMO
      Memo.find({ _id: { $lt: objId } })
        .sort({ _id: -1 })
        .limit(6)
        .exec((err, memos) => {
          if (err) throw err;
          return res.json(memos);
        });
    }
  },

  readUser: (req, res) => {
    Memo.find({ writer: req.params.username })
      .sort({ _id: -1 })
      .limit(6)
      .exec((err, memos) => {
        if (err) throw err;
        res.json(memos);
      });
  },

  readUserList: (req, res) => {
    let listType = req.params.listType;
    let id = req.params.id;

    // CHECK LIST TYPE VALIDITY
    if (listType !== 'old' && listType !== 'new') {
      return res.status(400).json({
        error: 'INVALID LISTTYPE',
        code: 1,
      });
    }

    // CHECK MEMO ID VALIDITY
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'INVALID ID',
        code: 2,
      });
    }

    let objId = new mongoose.Types.ObjectId(req.params.id);

    if (listType === 'new') {
      // GET NEWER MEMO
      Memo.find({ writer: req.params.username, _id: { $gt: objId } })
        .sort({ _id: -1 })
        .limit(6)
        .exec((err, memos) => {
          if (err) throw err;
          return res.json(memos);
        });
    } else {
      // GET OLDER MEMO
      Memo.find({ writer: req.params.username, _id: { $lt: objId } })
        .sort({ _id: -1 })
        .limit(6)
        .exec((err, memos) => {
          if (err) throw err;
          return res.json(memos);
        });
    }
  },

  modify: (req, res) => {
    // check memo id validity
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'INVALID ID',
        code: 1,
      });
    }

    // check contents valid
    if (typeof req.body.contents !== 'string') {
      return res.status(400).json({
        error: 'EMPTY CONTENTS',
        code: 2,
      });
    }
    if (req.body.contents === '') {
      return res.status(400).json({
        error: 'EMPTY CONTENTS',
        code: 2,
      });
    }

    // check login status
    if (typeof req.session.loginInfo === 'undefined') {
      return res.status(403).json({
        error: 'NOT LOGGED IN',
        code: 3,
      });
    }

    // find memo
    Memo.findById(req.params.id, (err, memo) => {
      if (err) throw err;

      // if memo does not exist
      if (!memo) {
        return res.status(404).json({
          error: 'NO RESOURCE',
          code: 4,
        });
      }

      // if exists, check writer
      if (memo.writer != req.session.loginInfo.username) {
        return res.status(403).json({
          error: 'PERMISSION FAILURE',
          code: 5,
        });
      }

      // modify and save in database
      memo.contents = req.body.contents;
      memo.date.edited = new Date();
      memo.is_edited = true;

      memo.save((err, memo) => {
        if (err) throw err;
        return res.json({
          success: true,
          memo,
        });
      });
    });
  },

  delete: (req, res) => {
    //check memo id validity
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'INBALID ID',
        code: 1,
      });
    }

    // check login status
    if (typeof req.session.loginInfo === 'undefined') {
      return res.status(403).json({
        error: 'NOT LOGGED IN',
        code: 2,
      });
    }

    // find memo and check for wirter
    Memo.findById(req.params.id, (err, memo) => {
      if (err) throw err;

      if (!memo) {
        return res.status(404).json({
          error: 'NO RESOURCE',
          code: 3,
        });
      }
      if (memo.writer != req.session.loginInfo.username) {
        return res.status(403).json({
          error: 'PERMISSION FAILURE',
          code: 4,
        });
      }

      // remove the memo
      Memo.remove({ _id: req.params.id }, (err) => {
        if (err) throw err;
        res.json({ success: true });
      });
    });
  },

  star: (req, res) => {
    // CHECK MEMO ID VALIDITY
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        error: 'INVALID ID',
        code: 1,
      });
    }

    // CHECK LOGIN STATUS
    if (typeof req.session.loginInfo === 'undefined') {
      return res.status(403).json({
        error: 'NOT LOGGED IN',
        code: 2,
      });
    }

    // FIND MEMO
    Memo.findById(req.params.id, (err, memo) => {
      if (err) throw err;

      // MEMO DOES NOT EXIST
      if (!memo) {
        return res.status(404).json({
          error: 'NO RESOURCE',
          code: 3,
        });
      }

      // GET INDEX OF USERNAME IN THE ARRAY
      let index = memo.starred.indexOf(req.session.loginInfo.username);

      // CHECK WHETHER THE USER ALREADY HAS GIVEN A STAR
      let hasStarred = index === -1 ? false : true;

      if (!hasStarred) {
        // IF IT DOES NOT EXIST
        memo.starred.push(req.session.loginInfo.username);
      } else {
        // ALREADY starred
        memo.starred.splice(index, 1);
      }

      // SAVE THE MEMO
      memo.save((err, memo) => {
        if (err) throw err;
        res.json({
          success: true,
          has_starred: !hasStarred,
          memo,
        });
      });
    });
  },
};

import express from 'express';
import Memo from '../models/memo';
import mongoose from 'mongoose';

const router = express.Router();

// WRITE MEMO
router.post('/', (req, res) => {
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
});

/*
    READ ADDITIONAL (OLD/NEW) MEMO: GET /api/memo/:listType/:id
*/
router.get('/:listType/:id', (req, res) => {
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
});

// MODIFY MEMO
router.put('/:id', (req, res) => {
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
});

// DELETE MEMO
router.delete('/:id', (req, res) => {
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
});

// GET MEMO LIST
router.get('/', (req, res) => {
  Memo.find()
    .sort({ _id: -1 })
    .limit(6)
    .exec((err, memos) => {
      if (err) throw err;
      res.json(memos);
    });
});

export default router;

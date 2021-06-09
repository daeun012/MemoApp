const express = require('express');
const memoController = require('../controllers/memoControllers');
exports.router = (() => {
  var memoRouter = express.Router();

  memoRouter.use('/*', (req, res, next) => {
    res.setHeader('Expires', '-1');
    res.setHeader('Cache-Control', 'must-revalidate, private');
    next();
  });

  memoRouter.route('/write').post(memoController.write);
  memoRouter.route('/read').get(memoController.read);
  memoRouter.route('/read/:listType/:id').get(memoController.readList);
  memoRouter.route('/read/:username').get(memoController.readUser);
  memoRouter.route('/read/:username/:listType/:id').get(memoController.readUserList);
  memoRouter.route('/modify/:id').put(memoController.modify);
  memoRouter.route('/delete/:id').delete(memoController.delete);
  memoRouter.route('/star/:id').post(memoController.star);
  return memoRouter;
})();

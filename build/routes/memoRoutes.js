"use strict";

var express = require('express');

var memoController = require('../controllers/memoControllers');

exports.router = function () {
  var memoRouter = express.Router();
  memoRouter.route('/write').post(memoController.write);
  memoRouter.route('/read').get(memoController.read);
  memoRouter.route('/read/:listType/:id').get(memoController.getList);
  memoRouter.route('/modify/:id').put(memoController.modify);
  memoRouter.route('/delete/:id')["delete"](memoController["delete"]);
  return memoRouter;
}();
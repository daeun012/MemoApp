"use strict";

var express = require('express');

var userController = require('../controllers/userControllers');

exports.router = function () {
  var userRouter = express.Router();
  userRouter.use('/*', function (req, res, next) {
    res.setHeader('Expires', '-1');
    res.setHeader('Cache-Control', 'must-revalidate, private');
    next();
  });
  userRouter.route('/login').post(userController.login);
  userRouter.route('/register').post(userController.register);
  userRouter.route('/logout').post(userController.logout);
  userRouter.route('/getInfo').get(userController.getInfo);
  userRouter.route('/search').get(userController.search);
  userRouter.route('/search/:username').get(userController.searchUser);
  return userRouter;
}();
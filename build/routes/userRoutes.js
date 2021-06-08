"use strict";

var express = require('express');

var userController = require('../controllers/userControllers');

exports.router = function () {
  var userRouter = express.Router();
  userRouter.route('/login').post(userController.login);
  userRouter.route('/register').post(userController.register);
  userRouter.route('/logout').post(userController.logout);
  userRouter.route('/getInfo').get(userController.getInfo);
  return userRouter;
}();
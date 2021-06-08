const express = require('express');
const userController = require('../controllers/userControllers');
exports.router = (() => {
  var userRouter = express.Router();
  userRouter.route('/login').post(userController.login);
  userRouter.route('/register').post(userController.register);
  userRouter.route('/logout').post(userController.logout);
  userRouter.route('/getInfo').get(userController.getInfo);
  return userRouter;
})();

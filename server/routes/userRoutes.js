const express = require('express');
const userController = require('../controllers/userControllers');
exports.router = (() => {
  var userRouter = express.Router();

  userRouter.use('/*', (req, res, next) => {
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
})();

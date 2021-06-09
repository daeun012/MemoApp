"use strict";

var User = require('../schemas/User');

module.exports = {
  login: function login(req, res) {
    if (typeof req.body.password !== 'string') {
      return res.status(401).json({
        error: 'LOGIN FAILED',
        code: 1
      });
    } // Find the user by username


    User.findOne({
      username: req.body.username
    }, function (err, user) {
      if (err) throw err; // Check account existancy

      if (!user) {
        return res.status(401).json({
          error: 'LOGIN FAILED',
          code: 1
        });
      } // Check wheter the password is valid


      if (!user.validateHash(req.body.password)) {
        return res.status(401).json({
          error: 'LOGIN FAILED',
          code: 1
        });
      } // Alter session


      var session = req.session;
      console.log(session);
      session.loginInfo = {
        _id: user._id,
        username: user.username
      }; // Retrun success

      return res.json({
        success: true
      });
    });
  },
  register: function register(req, res) {
    console.log('hi'); // Check username format

    var usernameRegex = /^[a-z0-9]+$/;

    if (!usernameRegex.test(req.body.username)) {
      return res.status(400).json({
        error: 'BAD USERNAME',
        code: 1
      });
    } // Check pass length


    if (req.body.password.length < 4 || typeof req.body.password !== 'string') {
      return res.status(400).json({
        error: 'BAD PASSWORD',
        code: 2
      });
    } // Check user existance


    User.findOne({
      username: req.body.username
    }, function (err, exists) {
      if (err) throw err;

      if (exists) {
        return res.status(409).json({
          error: 'USERNAME EXISTS',
          code: 3
        });
      }

      var user = new User({
        username: req.body.username,
        password: req.body.password
      });
      user.password = user.generateHash(user.password);
      user.save(function (err) {
        if (err) throw err;
        return res.json({
          success: true
        });
      });
    });
  },
  logout: function logout(req, res) {
    req.session.destroy(function (err) {
      if (err) throw err;
    });
    return res.json({
      sucess: true
    });
  },
  getInfo: function getInfo(req, res) {
    if (typeof req.session.loginInfo == 'undefined') {
      return res.status(401).json({
        error: 1
      });
    }

    return res.json({
      info: req.session.loginInfo
    });
  },
  search: function search(req, res) {
    res.json([]);
  },
  searchUser: function searchUser(req, res) {
    // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
    console.log('username', req.params.username);
    var re = new RegExp('^' + req.params.username);
    User.find({
      username: {
        $regex: re
      }
    }, {
      _id: false,
      username: true
    }).limit(5).sort({
      username: 1
    }).exec(function (err, users) {
      if (err) throw err;
      res.json(users);
    });
  }
};
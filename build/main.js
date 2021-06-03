"use strict";

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var express = require('express');

var path = require('path');

var morgan = require('morgan');

var mongoose = require('./confing/monggose.js');

var session = require('express-session');

var webpack = require('webpack');

var WebpackDevServer = require('webpack-dev-server');

var app = express();
var port = 3000;
var devPort = 9000; // mongodb 연결

mongoose();
app.use(morgan('dev'));
app.use('/', express["static"](path.join(__dirname, './../public')));
app.use(express.json({
  limit: '10mb',
  extended: true
}));
app.use(express.urlencoded({
  limit: '10mb',
  extended: true
}));
app.use(session({
  secret: 'CodeLab1$1$234',
  resave: false,
  saveUninitialized: true
}));
app.use('/api', _routes["default"]);
app.listen(port, function () {
  console.log('Listening on port: ', port);
});
app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './../public/index.html'));
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');

  var config = require('../webpack.dev.config');

  var compiler = webpack(config);
  var devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}
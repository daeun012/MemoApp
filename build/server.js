"use strict";

var express = require('express');

var app = express();

var http = require('http').Server(app);

var path = require('path');

var webpack = require('webpack');

var WebpackDevServer = require('webpack-dev-server');

var session = require('express-session');

var morgan = require('morgan');

var mongoose = require('mongoose');

var userRoutes = require('./routes/userRoutes');

var memoRoutes = require('./routes/memoRoutes');

var port = 3000;
var devPort = 9000;
http.listen(port, function () {
  console.log('Listening on port: ', port);
}); // mongodb 연결하기

var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('Connected to mongod server');
});
mongoose.connect('mongodb://localhost:27017/memo');
/* Middleware */

app.use('/', express["static"](path.join(__dirname, './../public')));
app.use(morgan('dev'));
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
/* Routes for API */

app.use('/users', userRoutes.router);
app.use('/memo', memoRoutes.router);
/* Support client-side routing */

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, './../public/index.html'));
}); // development 환경일 때 개발서버를 킴

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');

  var config = require('../webpack.dev.config');

  var compiler = webpack(config);
  var devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}
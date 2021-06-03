"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var port = 3000;
var devPort = 9000;
app.use('/', _express["default"]["static"](_path["default"].join(__dirname, './../public')));
app.use('/api', _routes["default"]);
app.get('/hello', function (req, res) {
  return res.send('Hello CodeLab');
});
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(port, function () {
  console.log('Express is listening on port', port);
});

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');

  var config = require('../webpack.dev.config');

  var compiler = (0, _webpack["default"])(config);
  var devServer = new _webpackDevServer["default"](compiler, config.devServer);
  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}
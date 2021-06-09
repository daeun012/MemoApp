const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

let session = require('express-session');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const memoRoutes = require('./routes/memoRoutes');

const port = 3000;
const devPort = 9000;

http.listen(port, () => {
  console.log('Listening on port: ', port);
});

// mongodb 연결하기
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Connected to mongod server');
});
mongoose.connect('mongodb://localhost:27017/memo');

/* Middleware */
app.use('/', express.static(path.join(__dirname, './../public')));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(
  session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true,
  })
);

/* Routes for API */
app.use('/users', userRoutes.router);
app.use('/memo', memoRoutes.router);

/* Support client-side routing */
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

// development 환경일 때 개발서버를 킴
if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  const config = require('../webpack.dev.config');
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(devPort, () => {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
import api from './routes';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

let app = express();

const port = 3000;
const devPort = 9000;

// mongodb 연결하기
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log('Connected to mongod server');
});
mongoose.connect('mongodb://localhost:27017/memo');

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, './../public')));
app.use(express.json({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(
  session({
    secret: 'CodeLab1$1$234',
    resave: false,
    saveUninitialized: true,
  })
);
app.use('/api', api);

app.listen(port, () => {
  console.log('Listening on port: ', port);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');
  const config = require('../webpack.dev.config');
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(devPort, () => {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}

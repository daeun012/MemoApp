"use strict";

var mongoose = require('mongoose');

module.exports = function () {
  function connect() {
    mongoose.connect('localhost:27017', function (err) {
      if (err) {
        console.error('mongodb connection error', err);
      }

      console.log('mongodb connected');
    });
  }

  connect();
  mongoose.connection.on('disconnected', connect);
};
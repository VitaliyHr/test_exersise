'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var user = new _mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  resetToken: String,
  dateToken: Date,
  books: [{
    _id: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: 'Books'
    }
  }]
});

exports.default = (0, _mongoose.model)('User', user);
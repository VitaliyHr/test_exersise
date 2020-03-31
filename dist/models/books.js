'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var books = new _mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isFinished: {
    type: Boolean,
    required: true
  },
  notes: String,
  count: {
    type: Number,
    default: 0
  },
  score: {
    type: Number
  },
  userId: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

exports.default = (0, _mongoose.model)('Books', books);
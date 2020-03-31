'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _auth = require('../middlewares/auth');

var _auth2 = _interopRequireDefault(_auth);

var _profile = require('../controllers/profile.controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

//зміна avatara
router.post('/', _auth2.default, _profile.Profile);

exports.default = router;
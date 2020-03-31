'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressFileupload = require('express-fileupload');

var _expressFileupload2 = _interopRequireDefault(_expressFileupload);

var _path = require('path');

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _mongoose = require('mongoose');

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _profile = require('./routes/profile');

var _profile2 = _interopRequireDefault(_profile);

var _books = require('./routes/books');

var _books2 = _interopRequireDefault(_books);

var _index = require('./keys/index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SessionStore = require('connect-mongodb-session')({ session: _expressSession2.default });


var app = (0, _express2.default)();

var PORT = process.env.PORT || 3000;

var store = new SessionStore({
  collection: 'sessions',
  uri: _index.MONGODB_URI
});

app.use(_express2.default.static((0, _path.join)(__dirname, 'images')));

app.use(_express2.default.urlencoded({ extended: true }));

app.use((0, _expressFileupload2.default)());

app.use(_express2.default.json());

app.use((0, _expressSession2.default)({
  resave: false,
  saveUninitialized: false,
  secret: _index.SESSION_SECRET,
  store: store
}));

app.use('/auth', _auth2.default);

app.use('/profile', _profile2.default);

app.use('/books', _books2.default);

async function start() {
  try {
    await (0, _mongoose.connect)(_index.MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    app.listen(PORT, function () {
      console.log('Server is alive on ' + PORT);
    });
  } catch (e) {
    console.log(e);
  }
}
start();
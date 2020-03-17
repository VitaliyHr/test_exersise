const { Schema, model } = require('mongoose');

const user = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  resetToken: String,
  dateToken: Date,
  books: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'Books',
      },
    },
  ],
});

module.exports = model('User', user);

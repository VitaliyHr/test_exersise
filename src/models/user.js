import { Schema, model } from 'mongoose';

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
  ],
});

export default model('User', user);

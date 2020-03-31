import { Schema, model } from 'mongoose';


const books = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  isFinished: {
    type: Boolean,
    required: true,
  },
  notes: String,
  count: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default model('Books', books);

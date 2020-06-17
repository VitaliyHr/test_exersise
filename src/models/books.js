// import { Schema, model } from 'mongoose';


// const books = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   author: {
//     type: String,
//     required: true,
//   },
//   isFinished: {
//     type: Boolean,
//     required: true,
//   },
//   notes: String,
//   count: {
//     type: Number,
//     default: 0,
//   },
//   score: {
//     type: Number,
//   },
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   CreatedAt: {
//     type: Schema.Types.Date,
//     required: true,
//     default: new Date(),
//   },
//   UpdatedAt: {
//     type: Schema.Types.Date,
//   },
// });

// export default model('Books', books);

const trigger = `CREATE TRIGGER set_timestamp
BEFORE UPDATE ON books
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();`;

const funct = `CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedat = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;`;

const table = `CREATE TABLE books(
  id SERIAL NOT NULL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  author VARCHAR(30) NOT NULL,
  isfinished BOOLEAN NOT NULL,
  notes TEXT,
  count INT NOT NULL DEFAULT 0,
  score INT NOT NULL DEFAULT 0,
  userid VARCHAR(40) NOT NULL,
  createdat TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updatedat TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

export {
  trigger,
  funct,
  table,
};

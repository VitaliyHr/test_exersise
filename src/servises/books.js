import pool from '../middlewares/pgconfig';
// import Books from '../models/books';
// export async function GetBooks() {
//   let books;

//   try {
//     books = await Books.find();
//   } catch (err) {
//     const error = 'Failed to adress to database';
//     throw new Error(error);
//   }

//   return books;
// }

// export async function SaveBookChanges(book) {
//   try {
//     await book.save();
//   } catch (err) {
//     const error = 'Failed to save changes.';
//     throw new Error(error);
//   }
// }

// export async function AddBook({ title, author, isFinished, notes }, userId) {
//   const CreatedAt = new Date();
//   const book = new Books({
//     title, author, isFinished, notes, userId, CreatedAt,
//   });
//   try {
//     await book.save();
//   } catch (err) {
//     const error = 'Failed to save changes';
//     throw new Error(error);
//   }
//   return book;
// }

// export async function FindBookByID(id) {
//   let books;

//   try {
//     books = await Books.findById(id);
//   } catch (err) {
//     const error = 'Failed to find element by bookId';
//     throw new Error(error);
//   }

//   return books;
// }

// export async function FindAndDelete(id) {
//   try {
//     await Books.findByIdAndDelete(id);
//   } catch (err) {
//     const error = 'Failed to delete book';
//     throw new Error(error);
//   }
// }


// export async function GetBooksByUserList(arr = []) {
//   let books;
//   try {
//     books = await Books.find({ _id: { $in: arr } });
//   } catch (err) {
//     const error = 'Failed to find books';
//     throw new Error(error);
//   }
//   return books;
// }

export async function GetBooks() {
  let books;

  try {
    books = await pool.query('SELECT * FROM books;');
  } catch (err) {
    const error = 'Failed to get books';
    throw error;
  }
  return books.rows;
}

export const SaveBookChanges = async ({
  title, author, isfinished, notes, score, count, userid, id,
}) => {
  try {
    await pool.query(`UPDATE books SET author=$1, score=$2,
    count=$3, userid=$4, isfinished=$5, notes=$6, title=$7 WHERE id=$8`,
    [author, score, count, userid, isfinished, notes, title, id]);
  } catch (err) {
    const error = 'Failed to save changes';
    throw error;
  }
};

export async function AddBook({
  title, author, isfinished, notes,
}, userid) {
  let result;
  try {
    result = await pool.query(`INSERT INTO books (title, author, isfinished, notes, score, count, userid )
    VALUES ($1, $2, $3, $4, DEFAULT ,DEFAULT, $5) RETURNING *;`,
    [title, author, isfinished, notes, userid]);
  } catch (err) {
    const error = 'Failed to add book';
    throw error;
  }
  return result.rows[0];
}


export async function FindBookByID(id) {
  let books;

  try {
    books = await pool.query('SELECT * FROM books WHERE id=$1;', [id]);
  } catch (err) {
    const error = 'Failed to find element by bookId';
    throw error;
  }

  return books.rows[0];
}

export async function FindAndDelete(id) {
  try {
    await pool.query('DELETE FROM books WHERE id=$1;', [id]);
  } catch (err) {
    const error = 'Failed to delete book';
    throw error;
  }
}

export async function GetBooksByUserList(arr = []) {
  let books;

  try {
    books = await pool.query(`SELECT * FROM books WHERE id IN(${arr})`);
  } catch (err) {
    const error = 'Failed to find books';
    throw error;
  }

  return books.rows;
}

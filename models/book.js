const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true
    },
    description: String,
    publisher: String,
    buy_url: String,
    img_url: String,
    pages: {
        type: Number,
        required: true
    },
    language: String
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

// Get books 
module.exports.getBooks = (callback, limit=50) => {
    Book.find(callback).limit(limit);
}

// Get one book by id
module.exports.getBookById = (id, callback) => {
    Book.findById(id, callback);
}

// Create new book
module.exports.addBook = (book, callback) => {
    const newBook = new Book(book);
    newBook.save(callback);
}

// Update book
module.exports.updateBook = (id, fields, callback) => {
    Book.findByIdAndUpdate(id, { $set: fields }, { new: true }, callback);
}

// Delete book
module.exports.removeBook = (id, callback) => {
    Book.findByIdAndRemove(id, callback);
}
const mongoose = require('mongoose')

const booksSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    genres: {
        type: [String],
        required: true
    },
    ratings: {
        type: Number,
        required: true
    },
    posted_by: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('books', booksSchema)
const express = require('express')
const router = express.Router()
const axios = require('axios')
const Books = require('../models/books')


router.get('/book-info', async (req, res) => {
    try {
      
      const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
        params: {
          q: '9780743273565+isbn',
          maxResults: 1
        }
      });
      
      const bookInfo = response.data.items[0]; 
      const { description, publisher, publishedDate } = bookInfo.volumeInfo;

      
      res.render('book-info', { description, publisher, publishedDate });

    } catch (error) {
      
      console.error('Error fetching book information:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding
router.route('/add')
    .get((req, res) => {
        res.render('form', {
            genres: [
                "adventure", 'science fiction', 'tragedy', 
                'romance', 'horror', 'comedy'
            ]
        });
    }).post(async (req, res) => {
        console.log(req.body)
        try {
            const book = new Books({
                isbn: req.body.isbn,
                title: req.body.title,
                pages: req.body.pages,
                genres: req.body.genres,
                ratings: req.body.ratings,
                posted_by: req.body.posted_by
            });

            await book.save();
            res.redirect('/');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });

// Viewing
router.get('/', async (req, res) => {
    try {
        const books = await Books.find()
        res.render('index', {books: books});
    } catch (err) {
        res.status(500).json({ message: err.message }) 
    }
});

// View one
router.get('/:id', getBook, (req, res) => {
    res.render('view-one', { book: res.locals.book }); 
});


// Editing
router.route("/edit/:id")
    .get(getBook, (req, res) => {
        res.render('edit-book', { book: res.locals.book });
    })
    .patch(getBook, async (req, res) => {
        try {
            const updatedBook = res.locals.book;
            updatedBook.isbn = req.body.isbn;
            updatedBook.title = req.body.title;
            updatedBook.pages = req.body.pages;
            updatedBook.genres = req.body.genres;
            updatedBook.ratings = req.body.ratings;
            updatedBook.posted_by = req.body.posted_by;
            await updatedBook.save();
            res.redirect(`/`);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    });




// Delete
router.delete('/:id', getBook, async (req, res) => { 
    try {   
        await res.locals.book.deleteOne(); 
        res.json({ message: 'Deleted Book' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }   
});

// Middleware  
async function getBook(req, res, next) {
    try {
        const book = await Books.findById(req.params.id)
        if (book === null) {
            return res.status(404).json({ message: 'Cannot find book' })
        }
        res.locals.book = book
        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = router

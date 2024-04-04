require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongoose = require('mongoose')
const path = require('path');


//Connecting
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

// Router
app.use(express.json())
const booksRouter = require('./routes/books')
app.use('/books', booksRouter)

app.use(bodyParser.urlencoded({ extended: true }));

const methodOverride = require('method-override');
app.use(methodOverride('_method'));


// Pug view
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Server
app.listen(3000, () => console.log("Server Started on 3000"))

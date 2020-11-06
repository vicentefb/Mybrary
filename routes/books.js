// Routes for authors

const express = require('express')
// indexRouter variable will be equal to router variable
const router = express.Router()
const multer = require('multer')
const path = require('path')
// We are going to use fs to be abel to delete a file from our database
const fs = require('fs')
const Book = require('../models/book')
// Combining two differnt paths
const uploadPath = path.join('public', Book.coverImageBasePath)
// TO be able to accept only image files
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
const Author = require('../models/author')

// To configure multer for our project
const upload = multer({
	dest: uploadPath,
	fileFilter: (req, file, callback) =>{
		callback(null, imageMimeTypes.includes(file.mimetype))
	}
})

// All Books Route
router.get('/', async (req, res) => {
	// We want to build this query based on the req.query data
	let query = Book.find()
	if(req.query.title != null && req.query.title != ''){
		// 'title' comes from our db model parameter, book.ititle on the db
		query = query.regex('title', new RegExp(req.query.title, 'i'))
	}
	// Published before
	if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
		// lte is less than or equal to
		query = query.lte('publishDate', req.query.publishedBefore)
	}
	// Published after logic
	if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
		// gte is greater than or equal to
		query = query.gte('publishDate', req.query.publishedAfter)
	}
	try{
		// Get book based on query
		const books = await query.exec()
		console.log(books)
		res.render('books/index', {
			books: books,
			searchOptions: req.query
		})
	} catch {
		// If we get an error we redirect
		res.redirect('/')
	}
	
})

// New Book Route for displaying the form
router.get('/new', async (req, res) => {
	renderNewPage(res, new Book())
})

// Create Book Route
// req.body.publishDate returns a string, thats why we use new Date()
// We want to send an upload variable to setup our route to accept files
// cover is whatever you set your input to be
// We are telling multer that we are uploading a single file with the name of cover
// it's going to do all the work behind the scenes for us to create a file, upload it to the server
// and put it in the correct folder.
// The library will also add a variable into our request called file
router.post('/', upload.single('cover'),  async (req, res) => {
	// Getting the filename if it exists
	const fileName = req.file != null ? req.file.filename: null
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		pageCount: req.body.pageCount,
		coverImageName: fileName, 
		description: req.body.description
	})
	console.log(book)
	try{
		// We want to save the book
		// if the book saves correctly we want to redirect to the books page
		const newBook = await book.save()
		//res.redirect('books/${newBook.id}')
		res.redirect('books')

	} catch {
		// If we have an error, before rendering the new page we call
		// removeBookCover()
		if (book.coverImageName != null){
			removeBookCover(book.coverImageName)
		}
		renderNewPage(res, book, true)
	}
})


// This function removes the book cover file from our server
function removeBookCover(fileName){
	fs.unlink(path.join(uploadPath, fileName), err =>{
		if(err) console.error(err)
	})
}


async function renderNewPage(res, book, hasError = false){
	try {
		const authors = await Author.find({})
		// We create this book so that when the user modifies it we can populate the fields that are already created
		// To dynamically create the error message
		const params = {
			authors: authors, 
			book: book
		}
		if (hasError) params.errorMessage = 'Error Creating Book'
		res.render('books/new', params)
	} catch {
		res.redirect('/books')
	}
}

// We are able to export our router variable so other files are allowed
// to access the exported code
module.exports = router
// Routes for authors

const express = require('express')
// indexRouter variable will be equal to router variable
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
// TO be able to accept only image files
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']

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
// it's going to do all the work behind the scenes for us to create a file, upload it to the server
// and put it in the correct folder.
// The library will also add a variable into our request called file
router.post('/',  async (req, res) => {
	// Getting the filename if it exists
	const book = new Book({
		title: req.body.title,
		author: req.body.author,
		publishDate: new Date(req.body.publishDate),
		pageCount: req.body.pageCount,
		description: req.body.description
	})
	// we set the name of our file input to cover in req.body.cover
	// fileName is now taken cover inside this function
	console.log(book)
	//console.log(req.body.cover)
	saveCover(book, req.body.cover)

	try{
		// We want to save the book
		// if the book saves correctly we want to redirect to the books page
		const newBook = await book.save()
		res.redirect(`books/${newBook.id}`)

	} catch {
		renderNewPage(res, book, true)
	}
})

// Show Book Route
router.get('/:id', async (req, res) => {
	try{
		// It will populate the author variable inside our Book object with all of the author information
		const book = await Book.findById(req.params.id).populate('author').exec()
		res.render('books/show', {book: book})
	} catch {
		res.redirect('/')
	}
})

// Edit Book Route
router.get('/:id/edit', async (req, res) => {
	try{
		const book = await Book.findById(req.params.id)
		renderEditPage(res, book)
	} catch {
		res.redirect('/')
	}

	
})

// Update book
router.put('/:id',  async (req, res) => {
	let book 

	try{
		book = await Book.findById(req.params.id)
		book.title = req.body.title
		book.author = req.body.author
		book.publishDate = new Date(req.body.publishDate)
		book.pageCount = req.body.pageCount
		book.description = req.body.description
		if(req.body.cover != null && req.body.cover !== ''){
			saveCover(book, req.body.cover)
		}
		await book.save()
		res.redirect(`/books/${book.id}`)

	} catch(err) {
		console.log(err)
		if(book != null){
			renderEditPage(res, book, true)
		}
		else{
			res.redirect('/')
		}
		
	}
})

// Delete Book Page
router.delete('/:id', async (req, res) => {
	let book
	try {
		book = await Book.findById(req.params.id)
		await book.remove()
		res.redirect('/books')
	} catch {
		if(book != null){
			res.render('books/show', {
				book: book, 
				errorMessage: 'Could not remove book'
			})
		}
		else{
			res.redirect('/')
		}
	}
})


async function renderNewPage(res, book, hasError = false){
	renderFormPage(res, book, `new`, hasError)
}

async function renderEditPage(res, book, hasError = false){
	renderFormPage(res, book, `edit`, hasError)
}

async function renderFormPage(res, book, form, hasError = false){
	try {
		const authors = await Author.find({})
		// We create this book so that when the user modifies it we can populate the fields that are already created
		// To dynamically create the error message
		const params = {
			authors: authors, 
			book: book
		}
		if (hasError){
			if(form === 'edit'){
				params.errorMessage = 'Error Updating Book'
			} 
			else{
				params.errorMessage = 'Error Creating Book'
			}
		}
		res.render(`books/${form}`, params)
	} catch {
		res.redirect('/books')
	}
}

function saveCover(book, coverEncoded){
	// check first if coverEncoded is a valid cover and then save it to book.cover
	if(coverEncoded == null) return
	const cover = JSON.parse(coverEncoded)
	if(cover != null && imageMimeTypes.includes(cover.type)){
		// cover.data holds the base64 encoded JSON string data of the image
		book.coverImage = new Buffer.from(cover.data, 'base64')
		book.coverImageType = cover.type
	}
}

// We are able to export our router variable so other files are allowed
// to access the exported code
module.exports = router
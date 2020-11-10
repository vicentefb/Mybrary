// Routes for authors

const express = require('express')
// indexRouter variable will be equal to router variable
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

// All Authors Route
router.get('/', async (req, res) => {
	// Variable to store all of our search objects
	let searchOptions = {}
	// We use req.query because in a GET the query is part of the url 
	// In a POST request it is sent through the req.body
	// localhost:3000/authors?name=John
	if(req.query.name != null && req.query.name !== ''){
		// The i in regexp is saying to be case insensitive
		searchOptions.name = new RegExp(req.query.name, 'i')
		console.log(searchOptions)
	}
	try {
		// Get all authors
		const authors = await Author.find(searchOptions)
		console.log(req.query)
		res.render('authors/index', {
			authors: authors, 
			searchOptions: req.query
		})	
	} catch {
		// If our db is not accessible for example
		res.redirect('/')
	}
	
})

// New Author Route for displaying the form
router.get('/new', (req, res) => {
	res.render('authors/new', {author: new Author() })	
})

// Create Author Route
// We make it async to make our db code less complex
router.post('/', async (req, res) => {
	// We are not rendering we are creating
	// req.body is the body of our form and .name is the name input
	const author = new Author({
		name: req.body.name
	})
	// to place our error statement 
	try{
		// We want to save the author in here
		// await to author.save() to finish and populate the newAuthor variable
		// Everything in mongoosedb is done asynchronously so we need to use await
		const newAuthor = await author.save()
		res.redirect(`/authors/${newAuthor.id}`)

	} catch {
		// catch will catch any error from our try
		// errorMessage will be displayed in errorMessage.ejs only if it is defined
		res.render('authors/new', {
			author: author,
			errorMessage: 'Error creating Author'
		})
	}
	// This was the previous piece of code
	// save the data to the database in this callback function
	// author.save((err, newAuthor) =>{
	// 	if(err){
	// 		// Passing parameters to the authors page
	// 		res.render('authors/new', {
	// 			author: author,
	// 			errorMessage: 'Error creating Author'
	// 		})
	// 	} else {
	// 		// res.redirect(`authors/${newAuthor.id}`)
	// 		res.redirect('authors')

	// 	}
	// })
})

// Authors route for showing our user, after : there's going to be a variable
// called id that's going to be passed on with the request
// This get by id needs to be placed after get /new because the server executes
// from top to bottom and it would have catched new as an id
router.get('/:id', async (req, res) => {
	try{
		const author = await Author.findById(req.params.id)
		const books = await Book.find({author: author.id}).limit(6).exec()
		res.render('authors/show', {
			author: author, 
			booksByAuthor: books
		})
	} catch{
		res.redirect('/')
	}
})

// Path for edit page
router.get('/:id/edit', async (req, res) => {
	try{
		// .findyById is mehtod built inside of MongoDB
		const author = await Author.findById(req.params.id)
		res.render('authors/edit', {author: author })
	}
	catch{
		res.redirect('/authors')
	}
})

// From our browser we can only make PUT and GET request
// We don't have a way from the browser to say PUT or DELETE
// We need to install a library called method-override
// This will help us to take a POST form, send that to our server with a special parameter
// that passes that tells us if we are doing a PUT or DELETE request in our server. 
// We setup that in our server.js file

// To update route
router.put('/:id', async (req, res) => {
	// author variable needs to be defined outside the try catch to be able to use it
	// inside catch as well
	let author
	// We want to get the existing author
	try{
		// Could fail here and return null to author
		author = await Author.findById(req.params.id)
		author.name = req.body.name
		// Could fail here as well
		await author.save()
		res.redirect(`/authors/${author.id}`)
	} catch {
		// catch will catch any error from our try
		// errorMessage will be displayed in errorMessage.ejs only if it is defined
		if(author == null){
			res.redirect('/')
		}
		else{
				res.render('authors/edit', {
				author: author,
				errorMessage: 'Error updating Author'
			})
		}
	}
})

// Never use a get link for deleting.
// In order to index the webapp on Google search webpages, it goes into every single
// get route in your application. So if you use a get link for deleting, it will delete
// every single thing in your application.
// That's why we need to use an entire form to delete something
// We also need to be careful when deleting an author and still reference a book from a deleted author
// For that we use packet string
router.delete('/:id', async (req, res) =>{
	let author
	// We want to get the existing author
	try{
		// Could fail here and return null to author
		author = await Author.findById(req.params.id)
		// Could fail here as well
		// Delete the author from the db
		await author.remove()
		res.redirect('/authors')
	} catch {
		// catch will catch any error from our try
		// errorMessage will be displayed in errorMessage.ejs only if it is defined
		if(author == null){
			res.redirect('/')
		}
		else{
			res.redirect(`/authors/${author.id}`)
		}
	}
})

// We are able to export our router variable so other files are allowed
// to access the exported code
module.exports = router
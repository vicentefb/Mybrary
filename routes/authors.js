// Routes for authors

const express = require('express')
// indexRouter variable will be equal to router variable
const router = express.Router()
const Author = require('../models/author')

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
		//res.redirect(`authors/${newAuthor.id}`)
	 	res.redirect('authors')

	} catch {
		// catch will catch any error from our try
		// errorMessage will be displayed in errorMessage.ejs only if it is defined
		res.render('authors/new', {
			author: author,
			errorMessage: 'Error creating Author'
		})
	}
	// This was the previous piece of code
	// save the data to the databse in this callback function
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

// We are able to export our router variable so other files are allowed
// to access the exported code
module.exports = router
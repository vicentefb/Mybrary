const express = require('express')
// indexRouter variable will be equal to router variable
const router = express.Router()
const Book = require('../models/book')

router.get('/', async (req, res) => {
	let books = []
	try {
		// books sorted by createdAt descending order
		books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec()
	} catch {
		books = []
	}
	res.render('index', {books: books})	
})

// We are able to export our router variable so other files are allowed
// to access the exported code
module.exports = router
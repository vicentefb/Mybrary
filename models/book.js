const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'

// Create a schema which is like a table
const bookSchema = new mongoose.Schema({
	// We define here the different columns of our schema which is going to be a JSON object
	title: {
		type: String, 
		required: true
	},
	description: {
		type: String
	},
	publishDate: {
		type: Date, 
		required: true
	},
	pageCount: {
		type: Number, 
		required: true
	},
	createAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	coverImageName: {
		type: String,
		required: true
	},
	author: {
		// We are going to reference the author from our Authors Collection in models/author.js
		// mongoose.Schema.Types.ObjectId is telling to reference another object inside our reference collection
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		// referencing the Author collection
		ref: 'Author'
	}
})

// We created a virtual property so it acts the same as any of the variables
// from above. 
// So when we call coverImagePath from books/index.ejs it is going to call the get function
// We use a normal function to have access to the this property
bookSchema.virtual('coverImagePath').get(function(){
	if(this.coverImageName != null){
		// Return a path
		// root of our object, uploads/bookCovers, the actual file name
		return path.join('/', coverImageBasePath, this.coverImageName)
	}
})

// export the schema
module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath
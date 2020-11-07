const mongoose = require('mongoose')


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
	coverImage: {
		type: Buffer,
		required: true
	},
	coverImageType: {
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
	if(this.coverImage != null && this.coverImageType != null){
		// data objects as a source for images takes the buffer data
		return `data: ${this.coverImageType};charset=utf-8;base64, ${this.coverImage.toString('base64')}`
	}
})

// export the schema
module.exports = mongoose.model('Book', bookSchema)
const mongoose = require('mongoose')
const Book = require('./book')
// Create a schema which is like a table
const authorSchema = new mongoose.Schema({
	// We define here the different columns of our schema which is going to be a JSON object
	name: {
		type: String, 
		required: true
	}
})

// the pre method helps us call a function before 'remove' action
authorSchema.pre('remove', function(next){
	// when author is equal to this.id it means we have books for that author
	Book.find({author: this.id}, (err, books)=>{
		if(err){
			// If there's an error this will prevent us from removing author
			next(err)
		} else if(books.length > 0){
			next(new Error('This author has no books still'))
		} else{
			// Tells Mongoose to remove author because everything is fine
			next()
		}
	})
})
// export the schema
module.exports = mongoose.model('Author', authorSchema)
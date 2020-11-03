const mongoose = require('mongoose')

// Create a schema which is like a table
const authorSchema = new mongoose.Schema({
	// We define here the different columns of our schema which is going to be a JSON object
	name: {
		type: String, 
		required: true
	}
})

// export the schema
module.exports = mongoose.model('Author', authorSchema)
// We are going to use MVC to hold our views folder

// Uploading file (using filepond library through a CDN) to be stored in the database instead of being stored on the server
// so we can use it with heroku easier. We put that CDN inside of the layouts page because we want it to appear in every single page.
// Initially, if we uploaded a file and restart the heroku server, it erases everything. 

// Check if we are running on the production environment or not
// We want to load the variable if we are in the development environment
if(process.env.NODE_ENV !== 'production'){
	require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
// Body-parser helps us get data from our server
const bodyParser = require('body-parser')
// To use PUT and DELETE requests
const methodOverride = require('method-override')

// route folder to hold the routes to differnt paths
// indexRouter variable is going to be set to the router variable in index.js
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')



app.set('view engine', 'ejs')
// Every view file will be placed inside this view folder
app.set('views', __dirname + '/views')
// Every single layout file will placed inside this layout
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
// Where our public files are going to be: css, style sheets, javascript files, images
app.use(express.static('public'))

// We are sending values thorugh a url encoded
// This configuration needs to take place before the routes configuration
app.use(bodyParser.urlencoded({limit: '10mb', extended: false }))


// Tell the app that we want to use 
app.use('/', indexRouter)
// Every route inside our authorRouter its going to be preempted to /authors path such as
// /authors
// /authors/new
app.use('/authors', authorRouter)
// Every route inside our bookRouter its going to be preempted to /books path such as
// /books
// /books/new
app.use('/books', bookRouter)



// We are going to import mongoose to be able to integrate the application with mongodb
const mongoose = require('mongoose')

// Set connection to the database
// We want the connection to be dynamic using URL
mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

const db = mongoose.connection
// if there's an error
db.on('error', error => console.error(error))

// Once we connect for the first time
db.once('open', () => console.log('Connected to Mongoose'))

app.listen(process.env.PORT || 3000)
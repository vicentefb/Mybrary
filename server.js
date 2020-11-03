// We are going to use MVC to hold our views folder

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

// route folder to hold the routes to differnt paths
// indexRouter variable is going to be set to the router variable in index.js
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')


app.set('view engine', 'ejs')
// Every view file will be placed inside this view folder
app.set('views', __dirname + '/views')
// Every single layout file will placed inside this layout
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
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
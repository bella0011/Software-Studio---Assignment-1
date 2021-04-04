if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const flash = require('connect-flash')
const session = require('express-session')

const indexRouter = require('./routes/index')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/users')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const uri = "mongodb+srv://eLibrary:SES1AG4@cluster0.ocp4f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Express Session
app.use(session ({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

// Connect Flash
app.use(flash())

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    next()
})

app.use('/', indexRouter)
app.use('/books', bookRouter)
app.use('/users', userRouter)

app.listen(process.env.PORT || 3000) 
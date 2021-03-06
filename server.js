﻿if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express() 
const expressLayouts = require('express-ejs-layouts')

const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const staffpassport = require('passport')
const adminpassport = require('passport')

require('./config/passport')(passport);
require('./config/staffpassport')(staffpassport);
require('./config/adminpassport')(adminpassport);

const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const bookRouter = require('./routes/books')
const userRouter = require('./routes/users')
const staffRouter = require('./routes/staff')
const adminRouter = require('./routes/admin')
const bookRequestRouter = require('./routes/bookRequests')

const User = require("./models/user")

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))


const MongoClient = require('mongodb').MongoClient;
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

//_Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//_StaffPassport middleware
app.use(staffpassport.initialize());
app.use(staffpassport.session());

//_AdminPassport middleware
app.use(adminpassport.initialize());
app.use(adminpassport.session());

// Connect Flash
app.use(flash())

//Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next()
})

app.use('/', indexRouter)
app.use('/books', bookRouter)
app.use('/users', userRouter)
app.use('/staff', staffRouter)
app.use('/admin', adminRouter)
app.use('/bookRequests', bookRequestRouter)

app.listen(process.env.PORT || 3000) 
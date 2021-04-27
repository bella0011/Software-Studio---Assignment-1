const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const { ensureAuthenticated } = require('../config/auth')

router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books })

})


//Dashboard Page

router.get('/dashboard', ensureAuthenticated,(req, res) => 
res.render('dashboard', {
    name: req.user.name
}))

module.exports = router 
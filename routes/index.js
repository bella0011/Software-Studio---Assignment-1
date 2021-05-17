const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const BookRequest = require('../models/bookRequest')
const { ensureAuthenticated } = require('../config/auth')

//Add Data for Fines
const chance = require('chance').Chance()
const shuffleArray = require('shuffle-array')
const { render } = require('ejs')

router.get('/', async (req, res) => {
    let book
    try {
        book = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        book = []
    }
    res.render('index', { books: book })

})

router.get('/lgIndex', async (req, res) => {
    let book
    try {
        book = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        book = []
    }
    res.render('lgIndex', { books: book })

})

//Dashboard Page

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    let book
    try {
        book = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        book = []
    }
    res.render('dashboard', { books: book , name: req.user.name})
    
})


//Admin's Dashboard
router.get('/admin/adminDashboard', (req, res) => res.render('admin/adminDashboard', {
    name: req.user.name
}))

router.get('/admin/staffBookRequests', (req, res) => res.render('admin/staffBookRequests', {
    name: req.user.name
}))

router.get('/admin/adminSearch', (req, res) => res.render('admin/adminSearch', {
    
}))



//------------------------------ Staff ------------------------------------------------------//
//Staff's Dashboard
router.get('/staff/staffDashboard', (req, res) => res.render('staff/staffDashboard', {
    name: req.user.name
}))

//Book Request Page
router.get('/staff/staffBookRequest', (req, res) => res.render('staff/staffBookRequest', {
    name: req.user.name
}))

//-------------------------------------------------------------------------------------------//


//Fine Page

router.get('/data',ensureAuthenticated,(req, res) => {
    const data = {
        headers: ["Book", "Price"],
        rows: new Array(5).fill(undefined).map(() => { //rows: new Vector.fill(undefined).map(() => {
            return [
                chance.name(),
                chance.age(),
            ]
        })
    };
    res.json({
        headers: data.headers,
        rows: shuffleArray(data.rows),
        lastUpdated: new Date().toISOString()
    })
});

router.get('/fines', (req, res) => {
    res.render('fines')
})

//Borrowed Books Page

router.get('/bookData', ensureAuthenticated, (req, res) => {
    const data = {
        headers: ["Book", "Days Remaining"],
        rows: new Array(5).fill(undefined).map(() => {
            return [
                chance.name(),
                chance.age(),
            ]
        })
    };
    res.json({
        headers: data.headers,
        rows: shuffleArray(data.rows),
        lastUpdated: new Date().toISOString()
    })
});

router.get('/borrows', (req, res) => {
    res.render('borrows')
})

//Admin Fine Page

router.get('/finedata',ensureAuthenticated,(req, res) => {
    const data = {
        headers: ["User","Book", "Price"],
        rows: new Array(5).fill(undefined).map(() => { //rows: new Vector.fill(undefined).map(() => {
            return [
                chance.name(),
                chance.name(),
                chance.age(),
            ]
        })
    };
    res.json({
        headers: data.headers,
        rows: shuffleArray(data.rows),
        lastUpdated: new Date().toISOString()
    })
});

router.get('/adminFines', (req, res) => {
    res.render('adminFines')
})

module.exports = router 
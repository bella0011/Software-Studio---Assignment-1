const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const BookRequest = require('../models/bookRequest')
const { ensureAuthenticated } = require('../config/auth')

//Add Data for Fines
const chance = require('chance').Chance()
const shuffleArray = require('shuffle-array')

router.get('/', async (req, res) => {
    let book
    try {
        book = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        book = []
    }
    res.render('index', { books: book })

})


//Dashboard Page

router.get('/dashboard', ensureAuthenticated,(req, res) => 
res.render('dashboard', {
    name: req.user.name
}))

//Admin's Dashboard
router.get('/admin/adminDashboard', (req, res) => res.render('admin/adminDashboard', {
    name: req.user.name
}))

router.get('/admin/staffBookRequests', (req, res) => res.render('admin/staffBookRequests', {
    name: req.user.name
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

const data = {
    headers: ["Name", "Book", "Price"],
    rows: new Array(10).fill(undefined).map(() => {
        return [
            chance.name(),
            chance.profession(),
            chance.age(),
        ]
    })
};

router.get('/finesdata',(req, res) => {
    res.json({
        headers: data.headers,
        rows: shuffleArray(data.rows),
        lastUpdated: new Date().toISOString()
    })
});

router.get('/fines', (req, res) => {
    res.render('fines')
})

module.exports = router 
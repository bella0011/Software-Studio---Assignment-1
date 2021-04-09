const express = require('express')

const router = express.Router()

//Index Page
router.get('/', (req, res) => {
    res.render('index')
})

//Dashboard Page

router.get('/dashboard', (req, res) => res.render('dashboard'))

module.exports = router 
const express = require('express')

const router = express.Router()
const User = require('../models/user')

//Register Route
router.get('/register', async (req, res) => {
    try {
        const user = new User()
        res.render('users/register', {
            user: user
        })
    } catch {
        res.redirect('/users')
    }
})

//Create User Route
router.post('/', async (req, res) => {

})

module.exports = router
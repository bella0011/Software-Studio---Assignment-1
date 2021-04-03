const express = require('express');

const router = express.Router();
const User = require('../models/user')

//Register Page
router.get('/register',(req, res) => res.render('users/register'));

//Register Handle
router.post('/register', (req, res) => {
    res.send('pass')
})

module.exports = router;
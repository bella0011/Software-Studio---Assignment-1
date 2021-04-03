const express = require('express');

const router = express.Router();
const User = require('../models/user')

//Register Page
router.get('/register',(req, res) => res.render('users/register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'})
    }

    //Check password match
    if(password !== password2) {
        errors.push({ msg: 'Password do not match'})
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        res.send('pass')
    }

})

module.exports = router;
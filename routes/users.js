const express = require('express');

const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user');
const Book = require("../models/book");
const Issue = require("../models/issue");
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

const userController = require('../controllers/user');

//Login Page
router.get('/login',(req, res) => res.render('users/login'));

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

    // Check Whether for requires not filled
    if(errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {

        // Validation Passed
        User.findOne( {email: email})
        .then(user => {
            if(user) {
                // Check If User Exist
                errors.push({ msg: 'Email is already registered'})
                res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                // Add New User
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })

                // Send Confirmation Email
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                })
                let mailOptions = {
                    from: 'westernelibrary@gmail.com',
                    to: req.body.email,
                    subject: 'Confirmation Email',
                    text: 'Email Confirmed'
                }
                transporter.sendMail(mailOptions);

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save User
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))

                }))
            }
        })    
    }

})

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

//// issue a book
//exports.postIssueBook = async (req, res, next) => {
//    try {
//        const book = await Book.findById(req.params.book_id);
//        const user = await User.findById(req.params.user_id);

//        book.stock -= 1;

//    } catch {
//        res.redirect('/');
//    }
//}

//user controller -> issue a book 
router.post("/books/:book_id/issue/:user_id", userController.postIssueBook);

module.exports = router;
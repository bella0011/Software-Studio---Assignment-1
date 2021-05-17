const express = require('express');

const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user')
const Book = require('../models/book')
const bcrypt = require('bcryptjs');
const adminpassport = require('passport');
const { forwardAuthenticated } = require('../config/auth');


//Admin Login Page
router.get('/adminlogin', (req, res) => res.render('admin/adminLogin'));

//Dashboard Page

router.get('/adminDashboard', async (req, res) => {
    let book
    try {
        book = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        book = []
    }
    res.render('adminDashboard', { books: book , name: req.user.name})
    
})

//Admin BookRequests
router.get('/bookRequests/index', (req, res) => res.render('bookRequests/index'));

//Admin adminSearch
router.get('/admin/adminSearch', (req, res) => res.render('admin/adminSearch'));

//Admin Login Button
router.post('/login', (req, res, next) => {
    adminpassport.authenticate('local/admin', {
        successRedirect: '/admin/adminDashboard',
        failureRedirect: '/admin/adminLogin',
        failureFlash: true
    })(req, res, next);
});



module.exports = router;
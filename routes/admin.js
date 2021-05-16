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

//Admin staffBookRequests
router.get('/admin/staffBookRequests', (req, res) => res.render('admin/staffBookRequests'));

//Admin Login Button
router.post('/login', (req, res, next) => {
    adminpassport.authenticate('local/admin', {
        successRedirect: '/admin/adminDashboard',
        failureRedirect: '/admin/adminLogin',
        failureFlash: true
    })(req, res, next);
});



module.exports = router;
const express = require('express');

const nodemailer = require('nodemailer');
const router = express.Router();
const User = require('../models/user')
const Book = require('../models/book')
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

//Staff Login Page
router.get('/staffLogin', (req, res) => res.render('staff/staffLogin'));

// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/staff/staffDashboard',
        failureRedirect: '/staff/staffLogin',
        failureFlash: true
    })(req, res, next);
});



module.exports = router;
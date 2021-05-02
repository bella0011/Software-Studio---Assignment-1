const express = require('express');

const nodemailer = require('nodemailer');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { forwardAuthenticated } = require('../config/auth');

const Book = require("../models/book");
const Issue = require("../models/issue");
const User = require("../models/user");

exports.postIssueBook = async(req, res, next) => {
    try {
        const book = await Book.findById(req.params.book_id);
        const user = await User.findById(req.params.user_id);

        book.stock -= 1;
        const issue = new Issue({
            book_info: {
                title: book.title,
                description: book.description,
                publishDate: book.publishDate,
                pageCount: book.pageCount,
                createdAt: book.createdAt,
                coverImage: book.coverImage,
                coverImageType: book.coverImageType,
                author: book.author,
                stock: book.stock,
                issueDate: book.issueDate,
                returnDate: book.returnDate,
                isRenewed: book.isRenewed,
            },
            
            user_id: {
                id:user._id,
                email: user.email,
            }
        });

        user.bookIssueInfo.push(book._id);

        await issue.save();
        await book.save();
        await user.save();

        res.redirect("/books/<%=book._id%>");

    } catch(err) {
        console.log(err);
    }
}
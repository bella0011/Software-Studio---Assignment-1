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
        return res.redirect("back");
    }
}

exports.postReturnBook = async(req, res, next) => {
    try {
        const book_id = req.params.book_id;
        const pos = req.user.bookIssueInfo.indexOf(req.params.book_id);
        
        // fetch the book from the database and update stock
        const book = await Book.findById(book_id);
        book.stock += 1;
        await book.save();

        // remove the issue object
        const issue = await Issue.findOne({"user_id.id": req.user._id});
        await issue.remove();

        // remove the issue info from user attributes
        req.user.bookIssueInfo.splice(pos, 1);
        await req.user.save();

        res.redirect("/borrows")
    }catch(err) {
        console.log(err);
        return res.redirect("back");
    }
}

exports.postRenewBook = async(req,res,next) =>{
    try {
        const searchObj = {
            "user_id.id": req.user_id,
            "book_info.id": req.params.book_id,
        }
        const issue = await Issue.findOne(searchObj);
        // adding  7 extra days to the returnDate attribute of selected issue
        let time = issue.book_info.returnDate.getTIme()
        issue.book_info.returnDate = time + 7*24*60*60*1000;
        lissue.book_info.isRenewed = true;
        await issue.save
    } catch (err) {
        console.log(err);
    }
}
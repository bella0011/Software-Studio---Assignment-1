const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
    book_info : {
        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        publishDate: {
            type: Date,
            required: true
        },

        pageCount: {
            type: Number,
            required: true
        },

        createdAt: {
            type: Date,
            required: true,
            default: Date.now
        },

        coverImage: {
            type: Buffer,
            required: true
        },
        coverImageType: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        stock: {
            type: Number,
            required: true
        },

        issueDate: {
            type: Date, 
            default : Date.now(),
            required: true
        },

        returnDate: {
            type: Date, 
            default : Date.now() + 7*24*60*60*1000,
            required: true
        },

        isRenewed: {
            type: Boolean,
            default : false
        },
    },

    user_id : {
        id : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User',
        },

        email: {
            type: String,
            required: true,
        },
    },



});

module.exports = mongoose.model("Issue", issueSchema);
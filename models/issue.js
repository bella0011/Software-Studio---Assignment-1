const mongoose = require("mongoose")

const issueSchema = new mongoose.Schema({
    book_info : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Book', 
        },
        title: {
            type: String
        },

        description: {
            type: String
        },

        publishDate: {
            type: Date
        },

        pageCount: {
            type: Number
        },

        coverImage: {
            type: Buffer
        },
        coverImageType: {
            type: String
        },
        
        author: {
            type: String
        },

        stock: {
            type: Number
        },

        issueDate: {
            type: Date, 
            default : Date.now(),
            
        },

        returnDate: {
            type: Date, 
            default : Date.now() + 7*24*60*60*1000,
            
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
        },
    },



});

module.exports = mongoose.model("Issue", issueSchema);
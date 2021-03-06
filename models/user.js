const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    violationFlag: {
        type: Boolean,
        default: false
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    staffFlag: {
        type: Boolean,
        default: false
    },

    bookIssueInfo: [
        {
            book_info: {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Issue",
                }
            },
        },
    ],
})

module.exports = mongoose.model('User', userSchema)
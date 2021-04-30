const express = require('express')
const router = express.Router()
const Book = require('../models/bookRequest')
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Books Route 
router.get('/', async (req, res) => {
    let query = Book.find()
    /*
    if (req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    */
    try {
        const books = await query.exec()
        res.render('bookRequests/index', {
            books: books,
            searchOptions: req.query,
            name: req.user.name
        })
    } catch {
        res.redirect('/')
    }
})

//New Book Route  
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

//Create Book Route
router.post('/', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover)

    try {
        const newBook = await book.save()
        res.redirect(`bookRequests/${newBook.id}`)
        //res.redirect(`bookRequests/index`)
    } catch {
        //console.log('hello')
        renderNewPage(res, bookRequest, true)
    }

})

//Show Book Route
router.get('/:id', async (req, res) => {
    try {
        const bookRequest = await Book.findById(req.params.id)
        res.render('bookRequests/show', { bookRequest: bookRequest })
    } catch {
        console.log('hello')
        res.redirect('/admin/staffBookRequests')
    }
})

//Edit Book Route 
router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book)
    } catch {
        res.redirect('/')
    }
})

//Update Book Route
router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id.trim())
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.pageCount = req.body.pageCount
        book.description = req.body.description
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (err) {
        console.log(err)
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            res.redirect('/')
        }
    }

})

//Delete Book Route
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/bookRequests')
    } catch {
        if (book != null) {
            res.render('bookRequests/show', {
                book: book,
                errorMessage: 'Could not remove book'
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, bookRequest, hasError = false) {
    renderFormPage(res, bookRequest, 'new', hasError)

}

async function renderEditPage(res, bookRequest, hasError = false) {
    renderFormPage(res, bookRequest, 'edit', hasError)
}

async function renderFormPage(res, bookRequest, form, hasError = false) {
    try {
        const params = {
            bookRequest: bookRequest
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book'
            }
            else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`bookRequests/${form}`, params)
    } catch {
        res.redirect('/staff/staffDashboard')
    }
}

function saveCover(bookRequest, coverEncoded) {
    if (coverEncoded == "") return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        bookRequest.coverImage = new Buffer.from(cover.data, 'base64')
        bookRequest.coverImageType = cover.type
    }
}


module.exports = router
const express = require('express');
const http = require('http');
const store = require('../models/store');
const Book = require('../models/book')
const router = express.Router();

router.get('/', function (request, response) {
    return response.render('books/index', {title: 'Все книги', items: store.select()})
})
router.get('/view/:id', function (request, response) {
    const book = store.select(request.params.id);
    if (book) {
        http.get(`http:counter/counter/${request.params.id}`, (res) => {
            const statusCode = res.statusCode;
            if (statusCode !== 200) {
                book.counter = 0;
            }
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                book.counter = Number(rawData);
                console.log('book.counter', book.counter);
            });
        }).on('error', (e) => {
            console.error(`Got error: ${e.message}`);
            book.counter = 0;
        });

        const options = {host: 'counter', path: `/counter/${request.params.id}/incr`, port: 80, method: 'POST',}
        const post = http.request(options, function (response) {
            response.resume();
        });
        post.on('error', function (err) {
            console.error(err)
        });
        post.write('');
        post.end();
        return response.render('books/view', {title: `Просмотр ${book.title}`, item: book})
    }
    return response.status(404).render('404')
})
router.get('/create', function (request, response) {
    return response.render('books/create', {title: 'Создание новой книги', fields: Book.defaultFields})
})
router.post('/create', function (request, response) {
    const book = store.add(request.body);
    return response.redirect(`/books`);
})
router.get('/update/:id', function (request, response) {
    const book = store.select(request.params.id);
    if (book) {
        return response.render('books/update', {title: `Просмотр ${book.title}`, item: book})
    }
    return response.status(404).render('404')
})
router.post('/update/:id', function (request, response) {
    const book = store.select(request.params.id);
    if (book) {
        book.update(request.body);
        return response.redirect(`/books`);
    }
    return response.status(404).render('404')
})
router.post('/delete/:id', function (request, response) {
    const book = store.select(request.params.id);
    if (book) {
        store.delete(request.params.id);
        return response.redirect(`/books`);
    }
    return response.status(404).render('404')
})

module.exports = router;
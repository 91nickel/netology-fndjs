"use strict";
var Book = require('./book');
var BookSchema = require('./bookSchema');
var BooksRepository = /** @class */ (function () {
    function BooksRepository() {
    }
    // создание книги
    BooksRepository.createBook = function (fields) {
        console.log('BooksRepository.createBook()', fields);
        return new Book(fields).save();
    };
    //получение книги по id
    BooksRepository.getBook = function (id) {
        console.log('BooksRepository.getBook()', id);
        return BookSchema.findById(id)
            .then(function (result) {
            console.log('Store.select()->result', id, result);
            return new Book(result);
        })
            .catch(function (error) {
            console.log('Store.select()->error', error);
        });
    };
    //получение всех книг
    BooksRepository.getBooks = function () {
        console.log('BooksRepository.getBooks()');
        return BookSchema.find()
            .then(function (result) {
            console.log('Store.select()->result', result);
            return result.map(function (fields) { return new Book(fields); });
        })
            .catch(function (error) {
            console.log('Store.select()->error', error);
        });
    };
    //обновление книги
    BooksRepository.updateBook = function (id, fields) {
        console.log('BooksRepository.updateBook()', id, fields);
        return this.getBook(id)
            .then(function (book) {
            return book.update(fields).save();
        })
            .catch(function (error) {
            console.error(error);
            return false;
        });
    };
    //удаление книги
    BooksRepository.deleteBook = function (id) {
        console.log('BooksRepository.deleteBook()', id);
        return this.getBook(id)
            .then(function (book) {
            return book.delete();
        })
            .catch(function (error) {
            console.error(error);
            return false;
        });
    };
    return BooksRepository;
}());
module.exports = BooksRepository;

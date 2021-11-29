const Book = require('./book');
const BookSchema = require('./bookSchema');

class BooksRepository {

    // создание книги
    static createBook(fields: object) {
        console.log('BooksRepository.createBook()', fields)
        return new Book(fields).save();
    }

    //получение книги по id
    static getBook(id: string) {
        console.log('BooksRepository.getBook()', id)
        return BookSchema.findById(id)
            .then(function (result: object) {
                console.log('Store.select()->result', id, result);
                return new Book(result);
            })
            .catch(function (error: object) {
                console.log('Store.select()->error', error)
            });
    }

    //получение всех книг
    static getBooks() {
        console.log('BooksRepository.getBooks()');
        return BookSchema.find()
            .then(function (result: object[]) {
                console.log('Store.select()->result', result);
                return result.map(fields => new Book(fields))
            })
            .catch(function (error: object) {
                console.log('Store.select()->error', error)
            });
    }

    //обновление книги
    static updateBook(id: string, fields: object) {
        console.log('BooksRepository.updateBook()', id, fields)
        return this.getBook(id)
            .then(function (book: object) {
                return book.update(fields).save();
            })
            .catch(function (error: object) {
                console.error(error);
                return false;
            })
    }

    //удаление книги
    static deleteBook(id: string) {
        console.log('BooksRepository.deleteBook()', id)
        return this.getBook(id)
            .then(function (book: object) {
                return book.delete();
            })
            .catch(function (error: object) {
                console.error(error);
                return false;
            })
    }
}

module.exports = BooksRepository;

const Book = require('./book');

class Store {
    constructor() {
        this.books = [];
    }

    select(id = null) {
        console.log('Store.select()', id)
        if (id === null) return this.books;

        const index = this.books.findIndex(function (el) {
            return el.id === id
        });
        if (index !== -1) {
            return this.books[index];
        }
        return false;
    }

    add(fields) {
        console.log('Store.add()', fields)
        const book = new Book(fields);
        this.books.push(book);
        return book;
    }

    update(id, fields) {
        console.log('Store.update()', id, fields)
        const book = this.select(id);
        if (book) {
            return book.update(fields);
        }
        return false;
    }

    delete(id) {
        const index = this.books.findIndex(function (el) {
            return el.id === id
        })
        if (index === -1) return false;
        return this.books.splice(index, 1);
    }

    generateTestBooks(count = 1) {
        for (let index = 0; index < count; index++) {
            const test = {...Book.defaultFields};
            Object.keys(test).forEach(function (key) {
                test[key] = `${key} for book ${index + 1}`;
            });
            this.add(test);
        }
    }
}

const store = new Store();

module.exports = store;
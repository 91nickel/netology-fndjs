import Book from './book.js';
import BookSchema from './bookSchema.js';

class Store {
    select(id = null) {
        console.log('Store.select()', id)
        if (id === null) {
            return BookSchema.find()
                .then(function (result) {
                    console.log('Store.select()->result', result);
                    return result.map(function (fields) {
                        console.log('typeof fields._id', typeof fields._id);
                        return new Book(fields);
                    })
                })
                .catch(function (error) {
                    console.log('Store.select()->error', error)
                });
        }
        return BookSchema.findById(id)
            .then(function (result) {
                console.log('Store.select()->result', id, result);
                return new Book(result);
            })
            .catch(function (error) {
                console.log('Store.select()->error', error)
            })
    }

    add(fields) {
        console.log('Store.add()', fields)
        return new Book(fields).save();
    }

    update(id, fields) {
        console.log('Store.update()', id, fields)
        return this.select(id)
            .then(function (book) {
                Object.keys(fields).forEach(key => book[key] = fields[key])
                return book.save();
            })
            .catch(function (error) {
                console.error(error);
                return false;
            })
    }

    delete(id) {
        console.log('Store.delete()', id)
        return this.select(id)
            .then(function (book) {
                return book.delete();
            })
            .catch(function (error) {
                console.error(error);
                return false;
            })
    }

    async generateTestBooks(count = 1) {
        const test = {...(new Book())};
        delete test._id;
        for (let index = 0; index < count; index++) {
            Object.keys(test).forEach(function (key) {
                test[key] = `${key} for book ${index + 1}`;
            });
            this.add(test);
        }
    }
}

const store = new Store();

export default store;
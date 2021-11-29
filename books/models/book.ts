const {v4: uuid} = require('uuid');
const BookSchema = require('./bookSchema');

interface BookInterface {
    _id: object | null;
    title?: string;
    description?: string;
    authors?: string;
    favorite?: string;
    fileCover?: string;
    fileName?: string;
    fileBook?: string;
    comments?: object[];
}

class Book implements BookInterface{

    _id: object | null = null;
    title: string = '';
    description: string = '';
    authors: string = '';
    favorite: string = '';
    fileCover: string = '';
    fileName: string = '';
    fileBook: string = '';
    comments: object[] = [];

    constructor(fields: object = {}) {
        Object.keys(this).forEach(function (key: string) {
            if (typeof fields[key] !== 'undefined')
                this[key] = fields[key]
        }.bind(this))
        console.log(this);
    }

    update(fields = {}) {
        Object.keys(fields).forEach(function (key) {
            if (key !== '_id' && typeof this[key] !== 'undefined') {
                this[key] = fields[key];
            }
        }.bind(this))
        return this;
    }

    save() {
        console.log('Book->save', this);
        if (typeof this._id === 'undefined') { // Значит объект еще не в базе
            return new BookSchema({...this}).save()
                .then(function (result) {
                    console.log('Book->saveNew->result', result);
                    this._id = result._id;
                    return this;
                }.bind(this))
                .catch(function (error) {
                    console.log('Book->saveNew->error', error);
                    return error;
                });
        } else { // а это уже в базе
            return BookSchema.findByIdAndUpdate(this._id, {...this})
                .then(function (result) {
                    console.log('Book->saveOld->result', result);
                    return this;
                }.bind(this))
                .catch(function (error) {
                    console.log('Book->saveOld->error', error);
                    return error;
                });
        }
    }

    delete() {
        console.log('Book->delete', this._id);
        return BookSchema.findByIdAndDelete(this._id)
            .then(function (result) {
                console.log('Book->delete->result', result);
                return result;
            })
            .catch(function (error) {
                console.log('Book->delete->error', error);
                return error;
            });
    }
}

module.exports = Book;


"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var uuid = require('uuid').v4;
var BookSchema = require('./bookSchema');
var Book = /** @class */ (function () {
    function Book(fields) {
        if (fields === void 0) { fields = {}; }
        this._id = null;
        this.title = '';
        this.description = '';
        this.authors = '';
        this.favorite = '';
        this.fileCover = '';
        this.fileName = '';
        this.fileBook = '';
        this.comments = [];
        Object.keys(this).forEach(function (key) {
            if (typeof fields[key] !== 'undefined')
                this[key] = fields[key];
        }.bind(this));
        console.log(this);
    }
    Book.prototype.update = function (fields) {
        if (fields === void 0) { fields = {}; }
        Object.keys(fields).forEach(function (key) {
            if (key !== '_id' && typeof this[key] !== 'undefined') {
                this[key] = fields[key];
            }
        }.bind(this));
        return this;
    };
    Book.prototype.save = function () {
        console.log('Book->save', this);
        if (typeof this._id === 'undefined') { // Значит объект еще не в базе
            return new BookSchema(__assign({}, this)).save()
                .then(function (result) {
                console.log('Book->saveNew->result', result);
                this._id = result._id;
                return this;
            }.bind(this))
                .catch(function (error) {
                console.log('Book->saveNew->error', error);
                return error;
            });
        }
        else { // а это уже в базе
            return BookSchema.findByIdAndUpdate(this._id, __assign({}, this))
                .then(function (result) {
                console.log('Book->saveOld->result', result);
                return this;
            }.bind(this))
                .catch(function (error) {
                console.log('Book->saveOld->error', error);
                return error;
            });
        }
    };
    Book.prototype.delete = function () {
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
    };
    return Book;
}());
module.exports = Book;

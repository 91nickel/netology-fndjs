const {Schema, model} = require('mongoose');

const BookSchema = new Schema({
    title: String,
    description: String,
    authors: String,
    favorite: String,
    fileCover: String,
    fileName: String,
    fileBook: String,
})

module.exports = model('BookSchema', BookSchema);
import pkg from 'mongoose';
const {Schema, model} = pkg;

const BookSchema = new Schema({
    title: String,
    description: String,
    authors: String,
    favorite: String,
    fileCover: String,
    fileName: String,
    fileBook: String,
    comments: Array,
})

export default model('BookSchema', BookSchema);
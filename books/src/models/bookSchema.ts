import pkg from 'mongoose';
const {Schema, SchemaTypes, model} = pkg;

const BookSchema = new Schema({
    title: SchemaTypes.String,
    description: SchemaTypes.String,
    authors: SchemaTypes.String,
    favorite: SchemaTypes.String,
    fileCover: SchemaTypes.String,
    fileName: SchemaTypes.String,
    fileBook: SchemaTypes.String,
    comments: SchemaTypes.Array,
})

export default model('BookSchema', BookSchema);
import BookSchema from './bookSchema';

type BookType = {
    //[key: string]: object | null | string | number | object[] | undefined
    _id?: object | null
    title?: string
    description?: string
    authors?: string
    favorite?: string
    fileCover?: string
    fileName?: string
    fileBook?: string
    comments?: object[]
    counter?: number
}

interface BookInterface {
    [key: string]: object | null | string | number | object[] | undefined

    save(): Promise<Book>

    delete(): Promise<Book>
}

export default class Book implements BookInterface {

    [key: string]: object | null | string | number | object[] | undefined

    static bookEmptyFields: BookType = {
        _id: null, title: '', description: '', authors: '', favorite: '', fileCover: '', fileName: '', fileBook: '',
        comments: [], counter: 0
    }

    constructor(fields: BookType) {
        Object.keys(Book.bookEmptyFields).forEach((key: string): void => {
            this[key] = fields[key] ? fields[key] : Book.bookEmptyFields[key]
            return;
        })
        console.log('Book->constructor()', this);
    }

    async save(): Promise<Book> {
        console.log('Book->save', this);
        if (this._id) { // Объект в базе
            try {
                const result = await BookSchema.findByIdAndUpdate(this._id, {...this});
                console.log('Book->saveOld->result', result);
            } catch (error) {
                console.log('Book->saveOld->error', error);
            }
        } else { // Объект еще не в базе
            try {
                const result = await new BookSchema({...this}).save();
                this._id = result._id;
                console.log('Book->saveNew->result', result);
            } catch (error) {
                console.log('Book->saveNew->error', error);
            }
        }
        return this;
    }

    async delete(): Promise<Book> {
        console.log('Book->delete', this._id);
        try {
            const result = await BookSchema.findByIdAndDelete(this._id);
            console.log('Book->delete->result', result);
        } catch (error) {
            console.log('Book->delete->error', error);
        }
        return this;
    }
}

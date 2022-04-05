import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from 'mongoose';
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {Book, BookDocument} from './schemas/book.schema';
import * as admin from 'firebase-admin';

export interface IBooksService {

    createBook(book: CreateBookDto): Promise<Book | void>;

    getBook(id: string): Promise<Book | void>;

    getBooks(): Promise<Array<Book> | void>;

    updateBook(id: string, fields: UpdateBookDto): Promise<Book | void>;

    deleteBook(id: string): Promise<Book | void>;

}

@Injectable()
export class BooksService implements IBooksService {

    @InjectModel(Book.name)
    private bookModel: Model<BookDocument>

    // создание книги
    async createBook(createBookDto: CreateBookDto): Promise<Book | void> {
        console.log('BooksRepository.createBook()', createBookDto);
        try {
            // return this.getBook('616de2b89c48aac7d9811895');
            const book = new this.bookModel(createBookDto);
            // console.log(book);
            return await book.save();
        } catch (error) {
            return console.error(error)
        }
    }

    //получение книги по id
    async getBook(id: string): Promise<Book | void> {
        console.log('BooksRepository.getBook()', id);
        try {
            const book = await this.bookModel.findById(id);
            // console.log(book);
            return book;
        } catch (error) {
            return console.error(error)
        }
    }

    //получение всех книг
    async getBooks(): Promise<Array<Book> | void> {
        console.log('BooksRepository.getBooks()...');
        try {
            const books = await this.bookModel.find().exec();
            // console.log(books);
            return books;
        } catch (error) {
            return console.error(error)
        }
    }

    //обновление книги
    async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Book | void> {
        console.log('BooksRepository.updateBook()', id, updateBookDto);
        const book = await this.bookModel.findByIdAndUpdate(id, updateBookDto, {new: true});
        // console.log(book);
        return book;
    }

    //удаление книги
    async deleteBook(id: string): Promise<Book | void> {
        console.log('BooksRepository.deleteBook()', id);
        const book = await this.bookModel.findByIdAndDelete(id);
        // console.log(book);
        return book;
    }

    //получение книги по id
    async getBookFB(id: string): Promise<FirebaseFirestore.DocumentData | void> {
        console.log('BooksRepository.getBookFB()', id);
        try {
            const doc = await admin.firestore().collection('books').doc(id).get();
            return {id: doc.id, ...doc.data()}
        } catch (error) {
            return console.error(error)
        }
    }

    //получение всех книг
    async getBooksFB(): Promise<object[] | void> {
        console.log('BooksRepository.getBooksFB()');
        try {
            const result = [];
            const query = await admin.firestore().collection('books').get();
            query.forEach(doc => {
                result.push({id: doc.id, ...doc.data()})
            })
            return result;
        } catch (error) {
            return console.error(error)
        }
    }

    // создание книги
    async createBookFB(createBookDto: CreateBookDto): Promise<object | void> {
        console.log('BooksRepository.createBookFB()', createBookDto);
        try {
            return await admin.firestore().collection('books').add(createBookDto);
        } catch (error) {
            return console.error(error)
        }
    }

    // апдейт книги
    async updateBookFB(id: string, updateBookDto: UpdateBookDto): Promise<object | void> {
        console.log('BooksRepository.updateBookFB()', updateBookDto);
        try {
            const db = admin.firestore().collection('books');
            const query = await db.doc(id).update(updateBookDto);
            const book = await db.doc(id).get();
            return {id: book.id, ...book.data()}
        } catch (error) {
            return console.error(error)
        }
    }

    // удаление книги
    async deleteBookFB(id: string): Promise<FirebaseFirestore.DocumentData | void> {
        console.log('BooksRepository.deleteBookFB()', id);
        try {
            const db = admin.firestore().collection('books');
            const query = await db.doc(id).get();
            const book = {id: query.id, ...query.data()}
            await db.doc(id).delete();
            return book;
        } catch (error) {
            return console.error(error)
        }
    }
}

/*
export class Book implements IBook {
    _id?: MongooseSchema.Types.ObjectId
    title: string = ''
    description: string = ''
    authors: string = ''
    favorite: string = ''
    fileCover: string = ''
    fileName: string = ''
    fileBook: string = ''
    comments: object[] = []

    constructor(fields: CreateBookDto = {}) {
        console.log('Book->constructor() ', fields)
        Object.keys(fields).forEach((key: string) => {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        })
        console.log('Book->constructor->fields', this);
    }

    async save(): Promise<Book> {
        console.log('Book->save', this);
        if (this._id) { // Объект в базе
            try {
                const result = await this.bookModel.findByIdAndUpdate(this._id, {...this});
                console.log('Book->saveOld->result', result);
            } catch (error) {
                console.log('Book->saveOld->error', error);
            }
        } else { // Объект еще не в базе
            try {
                const result = await new this.bookModel({...this}).save();
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
        return this;
    }

    update(fields: UpdateBookDto): Book {
        Object.keys(fields).forEach((key) => {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        })
        return this;
    }
}
*/
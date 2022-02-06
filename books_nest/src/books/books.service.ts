import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from 'mongoose';
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {Book, BookDocument} from './schemas/book.schema';

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
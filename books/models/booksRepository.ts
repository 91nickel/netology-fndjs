import {injectable, inject} from "inversify";
import "reflect-metadata";
import {Book} from './book';
import BookSchema from './bookSchema';
import {BookType} from './types';
import {IBooksRepository} from "./interfaces";

@injectable()
export class BooksRepository implements IBooksRepository {
    // создание книги
    async createBook(fields: BookType): Promise<Book | void> {
        console.log('BooksRepository.createBook()', fields)
        const book: Book = new Book(fields);
        try {
            await book.save();
            return book
        } catch (error) {
            return console.error(error)
        }
    }

    //получение книги по id
    async getBook(id: string): Promise<Book | void> {
        console.log('BooksRepository.getBook()', id)
        try {
            const bookFields: BookType = (await BookSchema.findById(id))._doc;
            const book: Book = new Book(bookFields);
            console.log('Store.select()->result', id, book);
            return book;
        } catch (error) {
            return console.error(error)
        }
    }

    //получение всех книг
    async getBooks(): Promise<Array<Book> | void> {
        console.log('BooksRepository.getBooks()...');
        try {
            let collection = await BookSchema.find();
            console.log('BooksRepository.getBooks()->result', collection);
            collection = collection.map(schema => {
                return new Book(schema._doc)
            });
            return collection;
        } catch (error) {
            return console.log('BooksRepository.getBooks()->error', error)
        }
    }

    //обновление книги
    async updateBook(id: string, fields: BookType): Promise<Book | void> {
        console.log('BooksRepository.updateBook()', id, fields)
        try {
            const book: Book | void = await this.getBook(id);
            if (book instanceof Book) {
                await book.update(fields).save();
                return book;
            }
        } catch (error) {
            return console.log('BookRepository.updateBook()->error', error)
        }
    }

    //удаление книги
    async deleteBook(id: string): Promise<Book | void> {
        console.log('BooksRepository.deleteBook()', id)
        try {
            const book: Book | void = await this.getBook(id);
            if (book instanceof Book) {
                await book.delete();
                return book;
            }
        } catch (error) {
            return console.log('BookRepository.deleteBook()->error', error)
        }
    }
}



import {Book} from "./book";
import {BookType} from "./types";

export interface IBook {
    _id: object | null
    title: string
    description: string
    authors: string
    favorite: string
    fileCover: string
    fileName: string
    fileBook: string
    comments: object[]
    counter: number

    update(fields: BookType): Book

    save(): Promise<Book>

    delete(): Promise<Book>
}

export interface IBooksRepository {
    createBook(book: BookType): Promise<Book | void>;

    getBook(id: string): Promise<Book | void>;

    getBooks(): Promise<Array<Book> | void>;

    updateBook(id: string, fields: BookType): Promise<Book | void>;

    deleteBook(id: string): Promise<Book | void>;
}

import {Test, TestingModule} from '@nestjs/testing';
import {BooksService} from './books.service';
import {getModelToken} from "@nestjs/mongoose";
import {Book} from "./schemas/book.schema";
import {IsOptional, IsString, MaxLength, MinLength} from "class-validator";
import {Schema} from "mongoose";

describe('BooksService', () => {
    let booksService: BooksService;

    const bookModel = {
        storage: [
            {
                _id: '1', title: 'string', description: 'string', authors: 'string', favorite: 'string',
                fileCover: 'string', fileName: 'string', fileBook: 'string', comments: []
            },
            {
                _id: '2', title: 'string', description: 'string', authors: 'string', favorite: 'string',
                fileCover: 'string', fileName: 'string', fileBook: 'string', comments: []
            },
        ],
        find() {
            return {exec: () => this.storage};
        },
        findById(id) {
            return this.storage.find(book => book._id === id);
        },
        findByIdAndUpdate(id, book) {
            return book;
        },
        findByIdAndDelete(id) {
            return this.storage.find(book => book._id === id);
        },
        save(book) {
            return book;
        },
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BooksService,
                {provide: getModelToken(Book.name), useValue: bookModel},
            ],
        }).compile();

        booksService = await module.resolve<BooksService>(BooksService);
    });

    it('should be defined', () => {
        expect(booksService).toBeDefined();
    });

    describe('getBooks', () => {
        it('should return an array of books', async () => {
            const result = bookModel.find().exec();
            jest.spyOn(booksService, 'getBooks').mockImplementation(async () => result);
            expect(await booksService.getBooks()).toEqual(result);
        });
    });
    describe('getBook', () => {
        it('should return a book', async () => {
            const id = '1';
            const result = bookModel.findById(id);
            jest.spyOn(booksService, 'getBook').mockImplementation(async () => result);
            expect(await booksService.getBook(id)).toEqual(result);
        });
    });
    describe('createBook', () => {
        it('should return a book', async () => {
            const book = {
                title: 'string', description: 'string', authors: 'string', favorite: 'string',
                fileCover: 'string', fileName: 'string', fileBook: 'string', comments: []
            };
            const result = bookModel.save(book);
            jest.spyOn(booksService, 'createBook').mockImplementation(async () => result);
            expect(await booksService.createBook(book)).toEqual(result);
        });
    });
    describe('updateBook', () => {
        it('should return a book', async () => {
            const id = '1';
            const book = {
                title: 'string', description: 'string', authors: 'string', favorite: 'string',
                fileCover: 'string', fileName: 'string', fileBook: 'string', comments: []
            };
            const result = bookModel.findByIdAndUpdate(id, book);
            jest.spyOn(booksService, 'updateBook').mockImplementation(async () => result);
            expect(await booksService.updateBook(id, book)).toEqual(result);
        });
    });
    describe('deleteBook', () => {
        it('should delete a book', async () => {
            const id = '1';
            const result = bookModel.findByIdAndDelete(id);
            jest.spyOn(booksService, 'updateBook').mockImplementation(async () => result);
            expect(await booksService.deleteBook(id)).toEqual(result);
        });
    });
});

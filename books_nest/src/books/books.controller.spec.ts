import request from 'supertest';
import {Test, TestingModule} from '@nestjs/testing';
import {BooksController} from './books.controller';
import {getModelToken} from "@nestjs/mongoose";
import {Book} from "./schemas/book.schema";
import {BooksService} from "./books.service";
import {INestApplication} from "@nestjs/common";
import {BooksModule} from "./books.module";

describe('BooksController', () => {
    let app: INestApplication;

    let bookModel = {

    }
    let booksService = {
        getBooks: () => {
            return ['test'];
        },
    };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                BooksService,
                {
                    provide: getModelToken(BooksService.name),
                    useValue: booksService,
                },
                {
                    provide: getModelToken(Book.name),
                    useValue: bookModel,
                },
            ],
        })
            // .overrideProvider(BooksService)
            // .useValue(booksService)
            .compile();

        app = moduleRef.createNestApplication();
        await app.init();

        // booksService = new BooksService();
        // booksController = new BooksController(booksService);
        // booksController = moduleRef.get<BooksController>(BooksController);
        // booksService = await moduleRef.resolve<BooksService>(BooksService);
    });

    it(`/GET /books`, () => {
        return request(app.getHttpServer())
            .get('/books')
            .expect(200)
            .expect({
                data: booksService.getBooks(),
            });
    });

    afterAll(async () => {
        await app.close();
    });

    // it('should be defined', () => {
    //     expect(controller).toBeDefined();
    // });

    // describe('findAll', () => {
    //     it('should return an array of books', async () => {
    //         const result = new Promise((resolve, reject) => {
    //             const result = ['test'];
    //             resolve(result)
    //         });
    //         jest.spyOn(booksService, 'getBooks').mockImplementation(() => result);
    //         expect(await booksController.getAll()).toBe(result);
    //     });
    // });
});

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Patch,
    Post, Render, Res,
    UseInterceptors,
    UsePipes
} from '@nestjs/common';
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BooksService} from "./books.service";
import {Book} from "./schemas/book.schema";
import {TestPipe} from "../pipes/test.pipe";
import {CreateBookPipe} from '../pipes/create.book.pipe';
import {JoiCreateBookPipe} from '../pipes/joi.create.book.pipe';
import {CreateBookSchema} from "../joi/create.book.schema";
import { Response } from 'express';

@Controller('books')
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter)
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get()
    // @UsePipes(TestPipe)
    async getAll(): Promise<Book[] | void> {
        console.log(`BooksController->getAll()`);
        return this.booksService.getBooks();
    }
    @Get('view/:id')
    // @UseInterceptors(LoggingInterceptor)
    // @UsePipes(TestPipe)
    async getOne(@Param('id', new TestPipe()) id: string): Promise<Book | void> {
        console.log(`BooksController->getOne(${id})`);
        return this.booksService.getBook(id);
    }
    @Post('create')
    async createOne(@Body(new JoiCreateBookPipe(CreateBookSchema)) body: CreateBookDto): Promise<Book | void> {
        console.log('BooksController->createOne()', body);
        console.log(`create one ${JSON.stringify(body)}`);
        return this.booksService.createBook(body);
    }
    @Patch('update/:id')
    async updateOne(@Param('id') id: string, @Body(new CreateBookPipe()) body: UpdateBookDto): Promise<Book | void> {
        console.log(`BooksController->updateOne(${id}) ${JSON.stringify(body)}`);
        return this.booksService.updateBook(id, body);
    }
    @Delete('delete/:id')
    async deleteOne(@Param('id') id: string): Promise<Book | void> {
        console.log(`BooksController->deleteOne(${id})`);
        return this.booksService.deleteBook(id);
    }
    @Get('show')
    async viewAll(@Res() res: Response) {
        console.log(`BooksController->viewAll()`);
        const templateData = {title: 'Books View All', books: await this.booksService.getBooks()};
        console.log('templateData', templateData);
        return res.render('index', templateData);
    }
    @Get('show/:id')
    async viewOne(@Param('id') id: string, @Res() res: Response) {
        console.log(`BooksController->viewOne()`);
        const templateData = {title: 'Books View one', item: await this.booksService.getBook(id)};
        console.log('templateData', templateData);
        return res.render('book', templateData);
    }
}

@Controller('api/books')
// @UseInterceptors(LoggingInterceptor)
// @UseFilters(HttpExceptionFilter)
export class ApiBooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get()
    async getAll(): Promise<object[] | void> {
        console.log(`ApiBooksController->getAll()`);
        return this.booksService.getBooksFB();
    }
    @Get('/:id')
    async getOne(@Param('id') id: string): Promise<object | void> {
        console.log(`ApiBooksController->getOne(${id})`);
        return this.booksService.getBookFB(id);
    }
    @Post()
    async createOne(@Body() body: CreateBookDto): Promise<object | void> {
        console.log('ApiBooksController->createOne()', body);
        console.log(`create one ${JSON.stringify(body)}`);
        return this.booksService.createBookFB(body);
    }
    @Patch('/:id')
    async updateOne(@Param('id') id: string, @Body() body: UpdateBookDto): Promise<object | void> {
        console.log(`ApiBooksController->updateOne(${id}) ${JSON.stringify(body)}`);
        return this.booksService.updateBookFB(id, body);
    }
    @Delete('/:id')
    async deleteOne(@Param('id') id: string): Promise<object | void> {
        console.log(`ApiBooksController->deleteOne(${id})`);
        return this.booksService.deleteBookFB(id);
    }
}

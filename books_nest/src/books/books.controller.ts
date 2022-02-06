import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    Param,
    Patch,
    Post,
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
        throw new HttpException({'test': 'test'}, 403);
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
}

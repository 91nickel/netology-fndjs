import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {CreateBookDto} from "./dto/create-book.dto";
import {UpdateBookDto} from "./dto/update-book.dto";
import {BooksService} from "./books.service";
import {Book} from "./schemas/book.schema";

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    @Get()
    async getAll(): Promise<Book[] | void> {
        return this.booksService.getBooks();
    }
    @Get('view/:id')
    async getOne(@Param('id') id: string): Promise<Book | void> {
        console.log(`get one book ${id}`);
        return this.booksService.getBook(id);
    }
    @Post('create')
    async createOne(@Body() body: CreateBookDto): Promise<Book | void> {
        console.log('BooksController->createOne()', body);
        console.log(`create one ${JSON.stringify(body)}`);
        return this.booksService.createBook(body);
    }
    @Patch('update/:id')
    async updateOne(@Param('id') id: string, @Body() body: UpdateBookDto): Promise<Book | void> {
        console.log(`update one book ${id} ${JSON.stringify(body)}`);
        return this.booksService.updateBook(id, body);
    }
    @Delete('delete/:id')
    async deleteOne(@Param('id') id: string): Promise<Book | void> {
        console.log(`delete one book ${id}`);
        return this.booksService.deleteBook(id);
    }
}

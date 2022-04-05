import {Module} from '@nestjs/common';
import {MongooseModule} from "@nestjs/mongoose";
import {ApiBooksController, BooksController} from "./books.controller";
import {BooksService} from "./books.service";
import {Book, BookSchema} from "./schemas/book.schema"

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Book.name, schema: BookSchema},
        ]),
    ],
    controllers: [BooksController, ApiBooksController],
    providers: [
        BooksService,
    ],
})
export class BooksModule {}

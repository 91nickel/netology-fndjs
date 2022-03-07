import {MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse} from '@nestjs/websockets';
import {Server} from 'ws';
import {BookCommentService} from "../book-comment/book-comment.service";
import {BookComment, BookCommentDocument} from "../book-comment/schemas/book-comment.schema";
import {CreateCommentDto} from "../book-comment/dto/create-comment.dto";
import {BooksService} from "../books/books.service";

@WebSocketGateway(8080)
export class Gateway {
    @WebSocketServer()
    server: Server;

    constructor(private readonly service: BookCommentService) {}

    @SubscribeMessage('getAllComments')
    getAllComments(@MessageBody() id: string): Promise<Array<BookComment> | void> {
        // console.log('Gateway->getAllComments()');
        return this.service.getByBook(id)
    }
    @SubscribeMessage('addComment')
    addComment(@MessageBody() data: CreateCommentDto): Promise<BookComment | void> {
        console.log('Gateway->addComment()', data);
        return this.service.create(data);
    }
}
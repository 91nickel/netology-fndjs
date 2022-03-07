import { Module } from '@nestjs/common';
import { Gateway } from './events.gateway';
import {BookCommentService} from "../book-comment/book-comment.service";
import {MongooseModule} from "@nestjs/mongoose";
import {BookComment, BookCommentSchema} from "../book-comment/schemas/book-comment.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: BookComment.name, schema: BookCommentSchema},
        ]),
    ],
    providers: [Gateway, BookCommentService],
})
export class EventsModule {}

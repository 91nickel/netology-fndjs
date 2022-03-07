import { Module } from '@nestjs/common';
import { BookCommentService } from './book-comment.service';
import {MongooseModule} from "@nestjs/mongoose";
import {BookComment, BookCommentSchema} from "./schemas/book-comment.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: BookComment.name, schema: BookCommentSchema},
    ]),
  ],
  providers: [BookCommentService]
})

export class BookCommentModule {}

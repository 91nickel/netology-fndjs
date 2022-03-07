import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MongooseScheme} from 'mongoose';

export type BookCommentDocument = BookComment & Document;

export interface IBookComment {
    _id?: MongooseScheme.Types.ObjectId
    bookId: string,
    comment: string,
}

@Schema()
export class BookComment implements IBookComment{
    @Prop()
    bookId: string = ''

    @Prop()
    comment: string = ''
}

export const BookCommentSchema = SchemaFactory.createForClass(BookComment);
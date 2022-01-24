import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
    @Prop()
    title: string = ''

    @Prop()
    description: string = ''

    @Prop()
    authors: string = ''

    @Prop()
    favorite: string = ''

    @Prop()
    fileCover: string = ''

    @Prop()
    fileName: string = ''

    @Prop()
    fileBook: string = ''

    @Prop()
    comments: object[] = []
}

export const BookSchema = SchemaFactory.createForClass(Book);
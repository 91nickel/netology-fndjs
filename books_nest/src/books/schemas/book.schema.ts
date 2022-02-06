import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MongooseScheme} from 'mongoose';
import {UpdateBookDto} from "../dto/update-book.dto";
import {CreateBookDto} from "../dto/create-book.dto";

export type BookDocument = Book & Document;

export interface IBook {
    _id?: MongooseScheme.Types.ObjectId
    title: string
    description: string
    authors: string
    favorite: string
    fileCover: string
    fileName: string
    fileBook: string
    comments: object[]
    /*
    update(fields: UpdateBookDto): Book

    save(): Promise<Book>

    delete(): Promise<Book>
    */
}

@Schema()
export class Book implements IBook{
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
    /*
    constructor(fields: CreateBookDto = {}) {
        console.log('Book->constructor() ', fields)
        Object.keys(fields).forEach((key: string) => {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        })
        console.log('Book->constructor->fields', this);
    }

    async save(): Promise<Book> {
        console.log('Book->save', this);
        if (this._id) { // Объект в базе
            try {
                const result = await this.bookModel.findByIdAndUpdate(this._id, {...this});
                console.log('Book->saveOld->result', result);
            } catch (error) {
                console.log('Book->saveOld->error', error);
            }
        } else { // Объект еще не в базе
            try {
                const result = await new this.bookModel({...this}).save();
                this._id = result._id;
                console.log('Book->saveNew->result', result);
            } catch (error) {
                console.log('Book->saveNew->error', error);
            }
        }
        return this;
    }

    async delete(): Promise<Book> {
        console.log('Book->delete', this._id);
        return this;
    }

    update(fields: UpdateBookDto): Book {
        Object.keys(fields).forEach((key) => {
            if (this.hasOwnProperty(key)) {
                this[key] = fields[key];
            }
        })
        return this;
    }
    */
}

export const BookSchema = SchemaFactory.createForClass(Book);
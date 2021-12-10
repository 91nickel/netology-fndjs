import {injectable, inject} from "inversify";
import "reflect-metadata";
import BookSchema from './bookSchema';
import {BookType} from "./types";
import {IBook} from "./interfaces";

@injectable()
export class Book implements IBook {
    public _id = null
    public title = ''
    public description = ''
    public authors = ''
    public favorite = ''
    public fileCover = ''
    public fileName = ''
    public fileBook = ''
    public comments = []
    public counter = 0

    constructor(fields: BookType = {}) {
        // console.log('Book->constructor() ', fields)
        Object.keys(fields).forEach((key: string) => {
            // console.log('... ', `key= ${key}  `, `hasOwnProperty=${this.hasOwnProperty(key)} `)
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
                const result = await BookSchema.findByIdAndUpdate(this._id, {...this});
                console.log('Book->saveOld->result', result);
            } catch (error) {
                console.log('Book->saveOld->error', error);
            }
        } else { // Объект еще не в базе
            try {
                const result = await new BookSchema({...this}).save();
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
        try {
            const result = await BookSchema.findByIdAndDelete(this._id);
            console.log('Book->delete->result', result);
        } catch (error) {
            console.log('Book->delete->error', error);
        }
        return this;
    }

    update (fields: BookType): Book {
        Object.keys(fields).forEach((key) => {
            if (typeof this[key] !== 'undefined') {
                this[key] = fields[key];
            }
        })
        return this;
    }
}

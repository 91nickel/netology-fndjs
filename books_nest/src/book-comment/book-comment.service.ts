import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from 'mongoose';
import {UpdateCommentDto} from "./dto/update-comment.dto";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {BookComment, BookCommentDocument} from './schemas/book-comment.schema';

@Injectable()
export class BookCommentService {
    @InjectModel(BookComment.name)
    private model: Model<BookCommentDocument>

    // создание комментария
    async create(dto: CreateCommentDto): Promise<BookComment | void> {
        console.log('BookCommentService.create()', dto);
        try {
            const entity = new this.model(dto);
            console.log(entity);
            return await entity.save();
        } catch (error) {
            return console.error(error)
        }
    }

    // получение комментария по id
    async getOne(id: string): Promise<BookComment | void> {
        console.log('BookCommentService.getOne()', id);
        try {
            const entity = await this.model.findById(id);
            console.log(entity);
            return entity;
        } catch (error) {
            return console.error(error)
        }
    }

    // получение комментария по id книги
    async getByBook(id: string): Promise<Array<BookComment> | void> {
        console.log('BookCommentService.getByBook()', id);
        try {
            const entity = await this.model.find({bookId: id});
            console.log(entity);
            return entity;
        } catch (error) {
            return console.error(error)
        }
    }

    // получение всех комментариев
    async getAll(): Promise<Array<BookComment> | void> {
        console.log('BookCommentService.getAll()');
        try {
            const entities = await this.model.find().exec();
            console.log(entities);
            return entities;
        } catch (error) {
            return console.error(error)
        }
    }

    // обновление комментария
    async update(id: string, dto: UpdateCommentDto): Promise<BookComment | void> {
        console.log('BookCommentService.update()', id, dto);
        try {
            const entity = await this.model.findByIdAndUpdate(id, dto, {new: true});
            console.log(entity);
            return entity;
        } catch (error) {
            return console.error(error)
        }
    }

    // удаление комментария
    async delete(id: string): Promise<BookComment | void> {
        console.log('BookCommentService.delete()', id);
        try {
            const entity = await this.model.findByIdAndDelete(id);
            console.log(entity);
            return entity;
        } catch (error) {
            return console.error(error)
        }
    }
}

import {Schema} from 'mongoose';

export class CreateBookDto {
    _id?: Schema.Types.ObjectId
    title?: string
    description?: string
    authors?: string
    favorite?: string
    fileCover?: string
    fileName?: string
    fileBook?: string
    comments?: object[]
}
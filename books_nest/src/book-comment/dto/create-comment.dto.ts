import {Schema} from "mongoose";

export class CreateCommentDto {
    _id?: Schema.Types.ObjectId
    bookId: string
    comment: string
}
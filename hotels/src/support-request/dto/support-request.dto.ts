import { Model, Schema as MongooseSchema } from "mongoose"

type ID = MongooseSchema.Types.ObjectId

interface ICreateSupportRequestDto {
    user: ID
    text: string
}

export class CreateSupportRequestDto implements ICreateSupportRequestDto {
    user: ID
    text: string
}

interface ISendMessageDto {
    author: ID
    supportRequest: ID
    text: string
}

export class SendMessageDto implements ISendMessageDto {
    author: ID
    supportRequest: ID
    text: string
}

interface IMarkAsReadMessagesDto {
    user: ID
    supportRequest: ID
    createdBefore: Date
}

export class MarkAsReadMessagesDto implements IMarkAsReadMessagesDto {
    user: ID
    supportRequest: ID
    createdBefore: Date
}

interface IListSupportRequestDto {
    user: ID | null
    isActive: boolean
}

export class ListSupportRequestsDto implements IListSupportRequestDto {
    user: ID | null
    isActive: boolean
    limit: string
    offset: string
}

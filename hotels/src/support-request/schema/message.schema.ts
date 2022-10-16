import { Prop, Schema, SchemaFactory }        from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type MessageDocument = Message & Document;

@Schema()
export class Message {

    @Prop({type: MongooseSchema.Types.ObjectId})
    readonly _id?: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId})
    author: MongooseSchema.Types.ObjectId

    @Prop()
    text: string

    @Prop()
    sentAt: Date

    @Prop()
    readAt: Date

}

export const MessageSchema = SchemaFactory.createForClass(Message);
import { Prop, Schema, SchemaFactory }        from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Message } from './message.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {

    @Prop({type: MongooseSchema.Types.ObjectId})
    readonly _id?: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId})
    user: MongooseSchema.Types.ObjectId

    @Prop()
    createdAt: Date

    @Prop()
    messages: Message[]

    @Prop()
    isActive: boolean

}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
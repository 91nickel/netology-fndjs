import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document, Schema as MongooseSchema} from 'mongoose'

export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
    // @Prop({type: MongooseSchema.Types.ObjectId})
    // readonly _id?: MongooseSchema.Types.ObjectId

    @Prop()
    title: string

    @Prop()
    description: string

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
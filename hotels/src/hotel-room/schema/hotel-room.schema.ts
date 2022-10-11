import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Document, Schema as MongooseSchema} from 'mongoose'

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
    @Prop({type: MongooseSchema.Types.ObjectId})
    readonly _id?: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId})
    hotel: MongooseSchema.Types.ObjectId

    @Prop()
    description: string

    @Prop()
    images: string[]

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date

    @Prop()
    isEnabled: boolean
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
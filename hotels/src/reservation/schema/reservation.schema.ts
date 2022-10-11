import { Prop, Schema, SchemaFactory }        from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {

    @Prop({type: MongooseSchema.Types.ObjectId})
    readonly _id?: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId})
    user?: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId})
    hotel?: MongooseSchema.Types.ObjectId

    @Prop({type: MongooseSchema.Types.ObjectId})
    room?: MongooseSchema.Types.ObjectId

    @Prop()
    dateStart: Date

    @Prop()
    dateEnd: Date
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

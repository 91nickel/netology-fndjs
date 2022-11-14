import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { HotelRoom } from '../../hotel-room/schema/hotel-room.schema';
import { Hotel } from '../../hotel/schema/hotel.schema';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  userId: MongooseSchema.Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Hotel.name })
  hotelId: MongooseSchema.Types.ObjectId | string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: HotelRoom.name })
  roomId: MongooseSchema.Types.ObjectId | string;

  @Prop()
  dateStart: Date;

  @Prop()
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

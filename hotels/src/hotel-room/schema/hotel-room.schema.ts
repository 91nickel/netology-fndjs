import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Hotel } from '../../hotel/schema/hotel.schema';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Hotel.name })
  hotel: MongooseSchema.Types.ObjectId | string;

  @Prop()
  description: string;

  @Prop()
  images: string[] = [];

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);

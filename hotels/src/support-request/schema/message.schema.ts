import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../user/schema/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  author: MongooseSchema.Types.ObjectId | string;

  @Prop()
  text: string;

  @Prop()
  sentAt: Date;

  @Prop()
  readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

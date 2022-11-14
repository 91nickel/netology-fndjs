import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { MessageDocument } from './message.schema';
import { User } from '../../user/schema/user.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name })
  user: MongooseSchema.Types.ObjectId | string;

  @Prop()
  createdAt: Date;

  @Prop()
  messages: MessageDocument[];

  @Prop()
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);

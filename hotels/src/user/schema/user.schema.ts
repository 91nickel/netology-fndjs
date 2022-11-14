import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../dto/user.dto';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  email: string;

  @Prop()
  passwordHash: string;

  @Prop()
  name: string;

  @Prop()
  contactPhone?: string;

  @Prop()
  role: Role = Role.Client;
}

export const UserSchema = SchemaFactory.createForClass(User);

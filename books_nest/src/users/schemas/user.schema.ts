import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Schema as MongooseScheme} from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

    @Prop()
    email: string = ''

    @Prop()
    password: string = ''

    @Prop()
    firstName: string = ''

    @Prop()
    lastName: string = ''
}

export const UserSchema = SchemaFactory.createForClass(User);
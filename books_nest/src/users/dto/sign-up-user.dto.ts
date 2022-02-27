import {Schema} from 'mongoose';

export class SignUpUserDto {
    _id?: Schema.Types.ObjectId
    email: string
    password: string
    firstName: string
    lastName: string
}
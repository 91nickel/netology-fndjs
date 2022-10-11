import { Schema as MongooseSchema } from 'mongoose'

export class SearchReservationDto {
    user: MongooseSchema.Types.ObjectId;
    dateStart: Date;
    dateEnd: Date;
}
import { Schema as MongooseSchema } from "mongoose"

type ID = MongooseSchema.Types.ObjectId

export class CreateReservationDto {
    user: ID;
    hotel: ID;
    room: ID;
    dateStart: Date;
    dateEnd: Date;
}
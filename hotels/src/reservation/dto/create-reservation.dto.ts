import { Schema as MongooseSchema } from "mongoose"

type ID = MongooseSchema.Types.ObjectId

interface ReservationDto {
    user: ID;
    hotel: ID;
    room: ID;
    dateStart: Date;
    dateEnd: Date;
}

export class CreateReservationDto implements ReservationDto {
    user: ID;
    hotel: ID;
    room: ID;
    dateStart: Date;
    dateEnd: Date;
}
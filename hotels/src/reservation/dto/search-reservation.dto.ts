import { Schema as MongooseSchema } from 'mongoose'

type ID = MongooseSchema.Types.ObjectId;

interface ReservationSearchOptions {
    user: ID;
    dateStart: Date;
    dateEnd: Date;
}

export class SearchReservationDto implements ReservationSearchOptions {
    user: ID;
    dateStart: Date;
    dateEnd: Date;
}
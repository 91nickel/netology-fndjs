import { Schema as MongooseSchema } from 'mongoose';

type ID = MongooseSchema.Types.ObjectId | string;

export interface ReservationDto {
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

export interface ReservationSearchOptions {
  user: ID;
  dateStart: Date;
  dateEnd: Date;
}

export class SearchReservationDto implements ReservationSearchOptions {
  user: ID;
  hotel?: ID;
  room?: ID;
  dateStart: Date;
  dateEnd: Date;
}

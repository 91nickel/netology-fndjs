import { Module }                         from '@nestjs/common';
import { ApiReservationController }       from './api-reservation.controller';
import { MongooseModule }                 from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "../reservation/schema/reservation.schema";
import { ReservationService }             from "../reservation/reservation.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Reservation.name, schema: ReservationSchema},
    ]),
  ],
  controllers: [ApiReservationController],
  providers: [ReservationService],
})
export class ApiReservationModule {}

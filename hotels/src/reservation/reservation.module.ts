import { Module }                         from '@nestjs/common';
import { ReservationService }             from './reservation.service';
import { MongooseModule }                 from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "./schema/reservation.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Reservation.name, schema: ReservationSchema},
        ]),
    ],
    providers: [ReservationService]
})
export class ReservationModule {

}
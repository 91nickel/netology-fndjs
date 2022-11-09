import { Module }                         from '@nestjs/common'
import { MongooseModule }                 from "@nestjs/mongoose"
import { Hotel, HotelSchema }             from "../hotel/schema/hotel.schema"
import { HotelRoom, HotelRoomSchema }     from "../hotel-room/schema/hotel-room.schema"
import { Reservation, ReservationSchema } from "../reservation/schema/reservation.schema"
import { ReservationService }             from "../reservation/reservation.service"
import { HotelService }                   from "../hotel/hotel.service"
import { HotelRoomService }               from "../hotel-room/hotel-room.service"
import { ApiReservationController }       from './api-reservation.controller'

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Reservation.name, schema: ReservationSchema},
        ]),
        MongooseModule.forFeature([
            {name: Hotel.name, schema: HotelSchema},
        ]),
        MongooseModule.forFeature([
            {name: HotelRoom.name, schema: HotelRoomSchema},
        ]),
    ],
    controllers: [ApiReservationController],
    providers: [ReservationService, HotelService, HotelRoomService],
})
export class ApiReservationModule {
}

import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schema/reservation.schema';
import { ReservationController } from './reservation.controller';
import { Hotel, HotelSchema } from '../hotel/schema/hotel.schema';
import {
  HotelRoom,
  HotelRoomSchema,
} from '../hotel-room/schema/hotel-room.schema';
import { HotelService } from '../hotel/hotel.service';
import { HotelRoomService } from '../hotel-room/hotel-room.service';
import { HotelModule } from '../hotel/hotel.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
    HotelModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, HotelService, HotelRoomService],
})
export class ReservationModule {}

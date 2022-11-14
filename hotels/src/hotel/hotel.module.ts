import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { Hotel, HotelSchema } from './schema/hotel.schema';
import { HotelRoomService } from '../hotel-room/hotel-room.service';
import {
  HotelRoom,
  HotelRoomSchema,
} from '../hotel-room/schema/hotel-room.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelController],
  providers: [HotelService, HotelRoomService],
})
export class HotelModule {}

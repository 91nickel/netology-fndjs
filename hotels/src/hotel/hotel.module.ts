import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { HotelRoomService } from '../hotel-room/hotel-room.service';
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "./schema/hotel.schema";
import { HotelRoom, HotelRoomSchema } from "../hotel-room/schema/hotel-room.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Hotel.name, schema: HotelSchema},
    ]),
    MongooseModule.forFeature([
      {name: HotelRoom.name, schema: HotelRoomSchema},
    ]),
  ],
  controllers: [HotelController],
  providers: [HotelService, HotelRoomService]
})
export class HotelModule {}

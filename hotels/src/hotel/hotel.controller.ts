import { Controller, Get, HttpCode, Param, Query, Req, Res }       from '@nestjs/common';
import { HotelService }                                            from "./hotel.service";
import { HotelRoomService }                                        from "../hotel-room/hotel-room.service";

@Controller('hotel')
export class HotelController {
    constructor(
        private readonly hotelService: HotelService,
        private readonly hotelRoomService: HotelRoomService,
    ) {
    }
}

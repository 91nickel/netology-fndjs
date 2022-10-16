import { Module }                     from '@nestjs/common';
import { ApiHotelController }         from './api-hotel.controller';
import { MongooseModule }             from "@nestjs/mongoose";
import { Hotel, HotelSchema }         from "../hotel/schema/hotel.schema";
import { HotelRoom, HotelRoomSchema } from "../hotel-room/schema/hotel-room.schema";
import { HotelService }               from "../hotel/hotel.service";
import { HotelRoomService }           from "../hotel-room/hotel-room.service";
import { User, UserSchema }           from "../user/schema/user.schema";
import { UserService }                from "../user/user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Hotel.name, schema: HotelSchema},
            {name: HotelRoom.name, schema: HotelRoomSchema},
            {name: User.name, schema: UserSchema},
        ]),
    ],
    controllers: [ApiHotelController],
    providers: [
        HotelService,
        HotelRoomService,
        UserService,
    ]
})
export class ApiHotelModule {
}

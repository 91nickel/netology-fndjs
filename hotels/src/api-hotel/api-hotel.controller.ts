import {
    Controller,
    Body, Query, Param,
    HttpException,
    Delete, Get, Patch, Post, Render, Res, Req, Put,
}                             from '@nestjs/common';
import { CreateHotelDto }     from "../hotel/dto/create-hotel.dto";
import { CreateHotelRoomDto } from "../hotel-room/dto/create-hotel-room.dto";
import { HotelService }       from "../hotel/hotel.service";
import { HotelRoomService }   from "../hotel-room/hotel-room.service";
import { UserService }        from "../user/user.service";
import { SearchHotelRoomDto } from "../hotel-room/dto/search-hotel-room.dto";

// TODO: Основной API для поиска номеров.
// Если пользователь не аутентифицирован или его роль client,
// то при поиске всегда должен использоваться флаг isEnabled: true.

@Controller('api')
export class ApiHotelController {

    constructor(
        private readonly hotelService: HotelService,
        private readonly hotelRoomService: HotelRoomService,
        private readonly userService: UserService,
    ) {
    }

    @Get('common/hotel-rooms')
    getRooms(@Query() query: SearchHotelRoomDto) {
        // TODO: Доступно всем пользователям, включая неаутентифицированных.
        console.log('ApiHotelController.getRooms');
        return `ApiHotelController.getRooms(${JSON.stringify(query)})`;
    }

    @Get('/api/common/hotel-rooms/:id')
    getRoom(@Param('id') id: string) {
        /*
            TODO: Получение подробной информации о номере. {
                Формат ответа
                {
                  "id": string,
                  "title": string,
                  "description": string,
                  "images": [string],
                  "hotel": {
                    "id": string,
                    "title": string,
                    "description": string
                  }
                }
         */
        console.log('ApiHotelController.getRoom', id);
        return `ApiHotelController.getRoom ${id}`;
    }

    @Get('/api/admin/hotels/')
    getHotels(@Query('limit') limit, @Query('offset') offset) {
        /*
            TODO: Добавление гостиницы администратором.
                Формат ответа:
                {
                    "id": string,
                    "title": string,
                    "description": string
                }
                Доступно только аутентифицированным пользователям с ролью admin.
                401 - если пользователь не аутентифицирован;
                403 - если роль пользователя не admin.
        */
        console.log('ApiHotelController.getHotels', {limit: limit, offset: offset});
        return `ApiHotelController.getHotels(${JSON.stringify({limit: limit, offset: offset})})}`;
    }

    @Post('/api/admin/hotels/')
    createHotel(@Body() body: CreateHotelDto) {
        /*
            TODO: Добавление гостиницы администратором.
                Формат ответа:
                {
                    "id": string,
                    "title": string,
                    "description": string
                }
                Доступно только аутентифицированным пользователям с ролью admin.
                401 - если пользователь не аутентифицирован;
                403 - если роль пользователя не admin.
        */
        console.log('ApiHotelController.createHotel', body);
        return `ApiHotelController.createHotel ${JSON.stringify(body)}`;
    }

    @Put('/api/admin/hotels/:id')
    updateHotel(@Param('id') id, @Body() body: Partial<CreateHotelDto>) {
        /*
        TODO: Изменение описания гостиницы администратором.
            Формат ответа:
            {
                "id": string,
                "title": string,
                "description": string
            }
            Доступно только аутентифицированным пользователям с ролью admin.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не admin.
         */
        console.log('ApiHotelController.updateHotel', id, body);
        return `ApiHotelController.updateHotel ${id} ${JSON.stringify(body)}`;
    }

    @Post('/api/admin/hotel-roomss/')
    createHotelRoom(@Body() body: CreateHotelRoomDto) {
        /*
            TODO: Добавление номера гостиницы администратором.
                Этот запрос предполагает загрузку файлов и должен использовать формат multipart/form-data.
                Формат ответа:
                {
                    "id": string,
                    "title": string,
                    "description": string,
                    "images": [string],
                    "isEnabled": boolean,
                    "hotel": {
                        "id": string,
                        "title": string,
                        "description": string
                    }
                }
                Доступно только аутентифицированным пользователям с ролью admin.
                401 - если пользователь не аутентифицирован;
                403 - если роль пользователя не admin.
         */
        console.log('ApiHotelController.createHotelRoom', body);
        return `ApiHotelController.createHotelRoom ${JSON.stringify(body)}`;
    }

    @Put('/api/admin/hotel-rooms/:id')
    updateHotelRoom(@Param('id') id, @Body() body: Partial<CreateHotelRoomDto>) {
        /*
            TODO: Добавление номера гостиницы администратором.
                Этот запрос предполагает загрузку файлов и должен использовать формат multipart/form-data.
                Формат ответа:
                {
                    "id": string,
                    "title": string,
                    "description": string,
                    "images": [string],
                    "isEnabled": boolean,
                    "hotel": {
                        "id": string,
                        "title": string,
                        "description": string
                    }
                }
                Доступно только аутентифицированным пользователям с ролью admin.
                401 - если пользователь не аутентифицирован;
                403 - если роль пользователя не admin.
         */
        console.log('ApiHotelController.updateHotelRoom', id, body);
        return `ApiHotelController.updateHotelRoom ${id} ${JSON.stringify(body)}`;
    }
}

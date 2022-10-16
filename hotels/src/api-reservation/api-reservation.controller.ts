import {
    Controller,
    Body, Query, Param,
    HttpException,
    Delete, Get, Patch, Post, Render, Res, Req, Put,
}                               from '@nestjs/common';
import { ReservationService }   from "../reservation/reservation.service";
import { CreateReservationDto } from "../reservation/dto/create-reservation.dto";

@Controller('api')
export class ApiReservationController {

    constructor(
        private readonly reservationService: ReservationService
    ) {
    }

    @Get('client/reservations')
    getReservations () {
        /*
        TODO: Список броней текущего пользователя.
        Формат ответа:
        [
          {
            "startDate": string,
            "endDate": string,
            "hotelRoom": {
              "title": string,
              "description": string,
              "images": [string]
            },
            "hotel": {
              "title": string,
              "description": string
            }
          }
        ]
        Доступно только аутентифицированным пользователям с ролью client.
        401 - если пользователь не аутентифицирован;
        403 - если роль пользователя не client.
        */
        console.log('ApiReservationController.getClientReservations');
        return `ApiHotelController.getClientReservations()`;
    }

    @Get('manager/reservations/:id')
    getReservationsByClientId (@Param('id') clientId: string) {
        /*
            TODO: Список броней конкретного пользователя.
            Формат ответа
            [
              {
                "startDate": string,
                "endDate": string,
                "hotelRoom": {
                  "title": string,
                  "description": string,
                  "images": [string]
                },
                "hotel": {
                  "title": string,
                  "description": string
                }
              }
            ]
            Доступно только аутентифицированным пользователям с ролью manager.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не manager.
        */
        console.log('ApiReservationController.getReservationsByClientId', clientId);
        return `ApiHotelController.getReservationsByClientId(${clientId})`;
    }

    @Post('client/reservations')
    createReservation (@Body() body: CreateReservationDto) {
        /*
        TODO: Создаёт бронь на номер на выбранную дату для текущего пользователя.
        Формат ответа:
        {
          "startDate": string,
          "endDate": string,
          "hotelRoom": {
            "title": string,
            "description": string,
            "images": [string]
          },
          "hotel": {
            "title": string,
            "description": string
          }
        }
        Доступно только аутентифицированным пользователям с ролью client.
        401 - если пользователь не аутентифицирован;
        403 - если роль пользователя не client;
        400 - если номера с указанным ID не существует или он отключён.
        */
        console.log('ApiReservationController.createClientReservation', body);
        return `ApiHotelController.getRooms(${JSON.stringify(body)})`;
    }

    @Delete('client/reservations/:id')
    deleteReservation (@Param('id') id: string) {
        /*
            TODO: Отменяет бронь пользователя.
            Формат ответа: Пустой ответ.
            Доступно только аутентифицированным пользователям с ролью client.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не client;
            403 - если ID текущего пользователя не совпадает с ID пользователя в брони;
            400 - если брони с указанным ID не существует.        }
        */
        console.log('ApiReservationController.deleteClientReservation', id);
        return `ApiHotelController.deleteClientReservation(${id})`;
    }

    @Delete('manager/reservations/:cid/:rid')
    deleteReservationByClientId (@Param('cid') clientId: string, @Param('rid') reservationId: string) {
        /*
            TODO: Отменяет бронь пользователя.
            Формат ответа: Пустой ответ.
            Доступно только аутентифицированным пользователям с ролью manager.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не manager;
            400 - если брони для пользователя с указанным ID не существует.
        */
        console.log('ApiReservationController.deleteClientReservation', clientId, reservationId);
        return `ApiHotelController.deleteClientReservation(${clientId}, ${reservationId})`;
    }

}

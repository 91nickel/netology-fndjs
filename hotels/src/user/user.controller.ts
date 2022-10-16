import {
    Controller,
    Body, Query, Param,
    HttpException,
    Delete, Get, Patch, Post, Render, Res, Req, Put,
}                        from '@nestjs/common';
import { UserService }         from "./user.service";
import { Role, SignUpUserDto } from "./dto/sign-up-user.dto";
import { SearchUserDto }       from "./dto/search-user.dto";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Post('api/admin/users/')
    createUser(@Body() body: SignUpUserDto) {
        /*
        TODO: Позволяет пользователю с ролью admin создать пользователя в системе.
            Формат ответа
            {
              "id": string,
              "email": string,
              "name": string,
              "contactPhone": string,
              "role": string
            }
            Доступно только пользователям с ролью admin.
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не admin.
        */
        console.log('UserController.createUser');
        return `UserController.createUser(${JSON.stringify(body)})`;
    }

    @Get('api/:role/users/')
    getUsers(@Param('role') role: Role, @Query() query: SearchUserDto) {
        /*
        TODO: Позволяет пользователю с ролью admin создать пользователя в системе.
            Query-параметры
            limit - количество записей в ответе;
            offset - сдвиг от начала списка;
            name - фильтр по полю;
            email - фильтр по полю;
            contactPhone - фильтр по полю.
            Формат ответа
            [
              {
                "id": string,
                "email": string,
                "name": string,
                "contactPhone": string
              }
            ]
            GET /api/admin/users/
            Доступно только пользователям с ролью admin.
            *
            GET /api/manager/users/
            Доступно только пользователям с ролью manager.
            *
            401 - если пользователь не аутентифицирован;
            403 - если роль пользователя не подходит.
        */
        console.log('UserController.createUser');
        return `UserController.createUser(${role}, ${JSON.stringify(query)})`;
    }

}

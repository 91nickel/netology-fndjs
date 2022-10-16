import {
    Controller,
    Body, Query, Param,
    HttpException,
    Delete, Get, Patch, Post, Render, Res, Req, Put,
}                        from '@nestjs/common';
import { UserService }   from "../user/user.service";
import { SignInUserDto } from "../user/dto/sign-in-user.dto";
import { SignUpUserDto } from "../user/dto/sign-up-user.dto";

@Controller('api/auth')
export class ApiAuthController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @Post('login')
    login (@Body() body: SignInUserDto) {
        /*
        TODO: —тартует сессию пользовател€ и выставл€ет Cookies.
            ‘ормат ответа
            {
              "email": string,
              "name": string,
              "contactPhone": string
            }
            ƒоступно только не аутентифицированным пользовател€м.
            401 - если пользовател€ с указанным email не существует или пароль неверный.
        */
        console.log('ApiAuthController.login', body);
        return `ApiAuthController.login(${JSON.stringify(body)})`;
    }

    @Post('logout')
    logout () {
        /*
        TODO: «авершает сессию пользовател€ и удал€ет Cookies.
            ‘ормат ответа: пустой
            ƒоступно только не аутентифицированным пользовател€м.
        */
        console.log('ApiAuthController.logout');
        return `ApiAuthController.logout()`;
    }

    @Post('register')
    register (@Body() body: SignUpUserDto) {
        /*
        TODO: ѕозвол€ет создать пользовател€ с ролью client в системе.
            ‘ормат ответа
            {
              "id": string,
              "email": string,
              "name": string
            }
            ƒоступно только не аутентифицированным пользовател€м.
            400 - если email уже зан€т.
        */
        console.log('ApiAuthController.register', body);
        return `ApiAuthController.register(${JSON.stringify(body)})`;
    }

}

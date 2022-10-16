import { Module }            from '@nestjs/common';
import { ApiAuthController } from './api-auth.controller';
import { AuthService }       from "../auth/auth.service";
import { UserService }       from "../user/user.service";
import { MongooseModule }    from "@nestjs/mongoose";
import { User, UserSchema }  from "../user/schema/user.schema";

/*
TODO:
 Модуль «Аутентификация и авторизация» предназначен для:
 управления сессией пользователя,
 регистрации пользователей.
 Хранение сессии должно реализовываться посредством библиотеки passport.js с хранением сессии в памяти приложения.
 Аутентификация пользователя производится с помощью модуля «Пользователи». Каждому пользователю назначается одна из ролей - клиент, администратор, консультант.
 */
@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
        ]),
    ],
    controllers: [ApiAuthController],
    providers: [AuthService, UserService],
})
export class ApiAuthModule {
}

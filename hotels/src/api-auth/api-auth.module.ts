import { Module }                      from '@nestjs/common';
import { MongooseModule }              from "@nestjs/mongoose";
import { PassportModule }              from "@nestjs/passport";
import { JwtModule }                   from "@nestjs/jwt";
import { ApiAuthController }           from './api-auth.controller';
import { AuthService }                 from '../auth/auth.service';
import { User, UserSchema }            from "../user/schema/user.schema";
import { JwtStrategy }                 from "../auth/strategies/jwt.strategy";
import { UserService }                 from "../user/user.service";
import { LocalStrategy }               from "../auth/strategies/local-auth.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";

/*
TODO:
 Модуль «Аутентификация и авторизация» предназначен для:
 управления сессией пользователя,
 регистрации пользователей.
 Хранение сессии должно реализовываться посредством библиотеки passport.js с хранением сессии в памяти приложения.
 Аутентификация пользователя производится с помощью модуля «Пользователи».
 Каждому пользователю назначается одна из ролей - клиент, администратор, консультант.
 */
@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
        ]),
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
                },
            }),
        }),
    ],
    controllers: [ApiAuthController],
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class ApiAuthModule {
}
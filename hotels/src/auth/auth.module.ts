import { Module }                      from '@nestjs/common';
import { MongooseModule }              from "@nestjs/mongoose";
import { PassportModule }              from "@nestjs/passport";
import { JwtModule }                   from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthService }                 from './auth.service';
import { User, UserSchema }            from "../user/schema/user.schema";
import { JwtStrategy }                 from "./strategies/jwt.strategy";
import { UserService }                 from "../user/user.service";
import { LocalStrategy }               from "./strategies/local-auth.strategy";


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
    providers: [AuthService, UserService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {
}

import {Module} from '@nestjs/common';
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./strategies/jwt.strategy";
import {MongooseModule} from "@nestjs/mongoose";
import {User, UserSchema} from "../users/schemas/user.schema";
import {AuthService} from './auth.service';
import {LocalStrategy} from "./strategies/local.strategy";
import {AuthController, UserController} from './auth.controller';

@Module({
    imports: [
        PassportModule,
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
        ]),
        JwtModule.register({secret: process.env.JWT_SECRET_KEY}),
    ],
    controllers: [AuthController, UserController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}

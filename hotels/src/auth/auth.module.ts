import { Module }                      from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule }              from '@nestjs/mongoose';
import { PassportModule }              from '@nestjs/passport';
import { JwtModule }                   from '@nestjs/jwt';
import { AuthController }              from './auth.controller';
import { AuthService }                 from './auth.service';
import { JwtStrategy }                 from './strategies/jwt.strategy';
import { LocalStrategy }               from './strategies/local-auth.strategy';
import { User, UserSchema }            from '../user/schema/user.schema';
import { UserService }                 from '../user/user.service';
import { YandexStrategy }              from "./strategies/yandex.strategy";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
  providers: [AuthService, UserService, LocalStrategy, JwtStrategy, YandexStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}

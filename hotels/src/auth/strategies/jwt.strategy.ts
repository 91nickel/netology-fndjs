import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService }                     from '@nestjs/config';
import { PassportStrategy }                  from '@nestjs/passport';
import { ExtractJwt, Strategy }              from 'passport-jwt';
import { Request }                           from 'express';
import { AuthService }                       from '../auth.service';
import { UserService }                       from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Authentication;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    public async validate(payload: any) {
        // console.log('JwtStrategy.validate()', payload)
        const user = await this.userService.findById(payload._id);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

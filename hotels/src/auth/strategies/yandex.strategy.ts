import { Injectable }       from '@nestjs/common';
import { ConfigService }    from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy }         from 'passport-yandex';
import { AuthService }      from '../auth.service';
import { UserService }      from '../../user/user.service';

@Injectable()
export class YandexStrategy extends PassportStrategy(Strategy) {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private configService: ConfigService,
    ) {
        super({
                clientID: configService.get('YANDEX_CLIENT_ID'),
                clientSecret: configService.get('YANDEX_CLIENT_SECRET'),
                callbackURL: configService.get('YANDEX_CALLBACK_URL'),
            },
            async function (accessToken, refreshToken, profile, done) {
                await userService.findOrCreate({email: profile.username}, profile, function (err, user) {
                    return done(err, user);
                });
            });

    }

}

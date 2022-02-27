import {Injectable, UnauthorizedException} from "@nestjs/common";
import {Strategy, ExtractJwt} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {AuthService} from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private service: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    public async validate(payload: any) {
        console.log('JwtStrategy.validate()', payload);
        const user = await this.service.validateUser(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }

}
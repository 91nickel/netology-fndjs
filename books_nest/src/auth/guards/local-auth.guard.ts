import {ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from "../auth.service";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {

    constructor() {
        super({usernameField: 'email', passwordField: 'password'});
    }

    public canActivate(context: ExecutionContext) {
        console.log('LocalAuthGuard.canActivate()');
        const body = context.switchToHttp().getRequest().body;
        body.username = body.email;
        return super.canActivate(context);
    }

    public handleRequest(err, user, info) {
        console.log('LocalAuthGuard.handleRequest()', err, user, info);
        if (err) throw err
        if (!user) throw new UnauthorizedException()
        return user
    }

}
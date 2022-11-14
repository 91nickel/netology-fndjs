import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  public canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  public handleRequest(err, user /*, info*/) {
    if (err) throw err;
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

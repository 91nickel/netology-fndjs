import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  public canActivate(context: ExecutionContext) {
    // console.log('JwtAuthGuard.canActivate()')
    return super.canActivate(context);
  }

  public handleRequest(err, user) {
    // console.log('JwtAuthGuard.handleRequest()')
    if (err) throw err;
    if (!user) return null;
    return user;
  }
}

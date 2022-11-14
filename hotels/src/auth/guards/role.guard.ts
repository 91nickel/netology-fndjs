import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Role, RequestWithUser } from '../../user/dto/user.dto';

const RoleGuard = (...roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      if (!request.user)
        throw new UnauthorizedException('You are not authorized');
      if (roles.length > 0 && !roles.includes(request.user.role))
        throw new ForbiddenException(
          `Access denied. Only for ${roles.join(', ')}`,
        );

      return true;
    }
  }
  return mixin(RoleGuardMixin);
};

export default RoleGuard;

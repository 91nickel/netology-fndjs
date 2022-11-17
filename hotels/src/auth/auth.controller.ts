import {
    HttpCode,
    Controller,
    Body,
    UseGuards,
    Get,
    Post,
    Res,
    Req,
    BadRequestException,
    UnauthorizedException,
}                                         from '@nestjs/common';
import { Response }                       from 'express';
import { UserService }                    from '../user/user.service';
import { AuthService }                    from './auth.service';
import { RequestWithUser, SignUpUserDto } from '../user/dto/user.dto';
import { LocalAuthGuard }                 from './guards/local-auth.guard';
import { JoiUserPipe }                    from '../pipe/user.pipe';
import { CreateUserSchema }               from '../joi/user.schema';
import { YandexGuard }                    from "./guards/yandex.guard";
import * as passport                      from 'passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
    }

    @HttpCode(201)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Req() request: RequestWithUser, @Res() response: Response) {
        const user = request.user;
        if (user) {
            response.setHeader('Set-Cookie', this.authService.getLoginCookie(user));
            return response.send({
                email: user.email,
                name: user.name,
                contactPhone: user.contactPhone,
            });
        }
        throw new UnauthorizedException('Wrong email or password');
    }

    @Post('logout')
    logout(@Req() request: RequestWithUser, @Res() response: Response) {
        const user = request.user;
        if (user) {
            response.setHeader('Set-Cookie', this.authService.getLogoutCookie());
            return response.send({});
        }
        throw new UnauthorizedException('You are not authorized');
    }

    @Post('register')
    async register(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Body(new JoiUserPipe(CreateUserSchema)) body: SignUpUserDto,
    ) {
        if (request.user) {
            throw new BadRequestException(`You must be unauthorized`);
        }
        const user = await this.userService.findByEmail(body.email);
        if (user) {
            throw new BadRequestException(
                `User with email ${body.email} already registered`,
            );
        }
        const result = await this.authService.signUp(body);
        return response.send({
            id: result._id.toString(),
            email: result.email,
            name: result.name,
        });
    }

    @UseGuards(YandexGuard)
    @Get('yandex/login')
    async yandexAuth(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        return response.send({})
    }

    @UseGuards(YandexGuard)
    @Get('yandex/callback')
    async yandexCallback(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const user = request.user;
        if (user) {
            response.setHeader('Set-Cookie', this.authService.getLoginCookie(user));
            return response.redirect('/api/auth/profile')
        }
        throw new UnauthorizedException('Wrong email or password');
    }

    @Get('profile')
    async yandexProfile(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        return response.send(request.user)
    }
}

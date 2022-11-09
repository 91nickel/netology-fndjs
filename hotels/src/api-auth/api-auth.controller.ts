import {
    Controller,
    Body,
    Query,
    Param,
    HttpException,
    Delete,
    Get,
    Patch,
    Post,
    Render,
    Res,
    Req,
    Put,
    UseGuards,
    BadRequestException,
    NotFoundException,
    HttpCode,
    UnauthorizedException,
}                                       from '@nestjs/common';
import { AuthGuard }                    from "@nestjs/passport";
import { UserService }                  from "../user/user.service";
import { AuthService }                                   from "../auth/auth.service";
import { RequestWithUser, SignInUserDto, SignUpUserDto } from "../user/dto/user.dto";
import { User, UserDocument }                            from "../user/schema/user.schema";
import { LocalAuthGuard }               from "../auth/guards/local-auth.guard";
import { Request, Response }            from "express";
import { JoiUserPipe }                  from "../pipe/user.pipe";
import { CreateUserSchema }             from "../joi/user.schema";

@Controller('api/auth')
export class ApiAuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {
    }

    @HttpCode(201)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        console.log('ApiAuthController.login()')
        const user = request.user;
        if (user) {
            console.log('Processing auth user...', user)
            response.setHeader('Set-Cookie', this.authService.getLoginCookie(user));
            return response.send({email: user.email, name: user.name, contactPhone: user.contactPhone});
        }
        throw new UnauthorizedException('Wrong email or password');
    }

    @Post('logout')
    logout(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        console.log('ApiAuthController.logout');
        const user = request.user;
        if (user) {
            console.log('Processing logout user...', user)
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
        console.log('ApiAuthController.register', body);
        if (request.user) {
            throw new BadRequestException(`You must be unauthorized`);
        }
        const user = await this.userService.findByEmail(body.email)
        if (user) {
            throw new BadRequestException(`User with email ${body.email} already registered`);
        }
        const result = await this.authService.signUp(body);
        return response.send({
            id: result._id.toString(),
            email: result.email,
            name: result.name,
        });
    }

}

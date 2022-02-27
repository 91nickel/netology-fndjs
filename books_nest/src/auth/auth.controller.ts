import {Body, Controller, Get, Post, Put, Request, UseGuards} from '@nestjs/common';
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {User} from "../users/schemas/user.schema";
import {SignUpUserDto} from "../users/dto/sign-up-user.dto";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt.guard";

@Controller('api/users')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async profile(@Request() request): Promise<User | void> {
        return request.user;
    }

    @Post('signin')
    @UseGuards(LocalAuthGuard)
    async signIn(@Request() request, @Body() body): Promise<User | void> {
        console.log('AuthController.signIn()', request.user);
        return this.authService.signIn(body);
    }

    @Put('signup')
    async signUp(@Body() body: SignUpUserDto): Promise<User | void> {
        console.log('AuthController.signUp()', body);
        console.log(`sign up ${JSON.stringify(body)}`);
        return this.authService.signUp(body);
    }
}

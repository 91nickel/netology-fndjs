import {Body, Controller, All, Get, Post, Put, Req, Res, UseGuards, Next} from '@nestjs/common';
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {User} from "../users/schemas/user.schema";
import {SignUpUserDto} from "../users/dto/sign-up-user.dto";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt.guard";
import {Request, Response} from 'express';
import admin from 'firebase-admin';

@Controller('api/users')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    async profile(@Req() request): Promise<User | void> {
        return request.user;
    }

    @Post('signin')
    @UseGuards(LocalAuthGuard)
    async signIn(@Req() request, @Body() body): Promise<User | void> {
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

@Controller('user')
export class UserController {
    constructor(
        private readonly authService: AuthService
    ) {
    }

    @Get('login')
    async login(@Req() request, @Res() response: Response): Promise<User | void> {
        console.log('UserController.login()', request.user);
        return response.render('login', {
            title: 'SignIn | SignUp',
            firstTitle: 'SignIn',
            secondTitle: 'SignUp',
            csrfToken: request.csrfToken(),
        });
    }

    @Get('profile')
    async profile(@Req() request, @Res() response: Response): Promise<User | void> {
        console.log('UserController.profile()', request.cookies.session);
        const sessionCookie = request.cookies.session || "";
        admin.auth()
            .verifySessionCookie(sessionCookie)
            .then(userRecord => {
                console.log('Successfully verified', userRecord);
                response.render("profile.ejs", {
                    title: 'Профиль',
                    userRecord: userRecord,
                    csrfToken: request.csrfToken(),
                });
            })
            .catch(error => {
                // console.error('Error in verification', error);
                response.redirect("/user/login");
            });
    }

    @Post('login')
    async signIn(@Req() request: Request, @Res() response: Response, @Body() body): Promise<User | void> {
        console.log('UserController.signIn()', request.user);
        const idToken = request.body.idToken.toString();
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        admin.auth()
            .createSessionCookie(idToken, {expiresIn})
            .then(sessionCookie => {
                    response.cookie('session', sessionCookie);
                    response.json({status: 'success'});
                },
                error => {
                    console.error('error', error);
                    response.status(401).redirect('/user/login');
                }
            );
    }

    @Post('signup')
    async signUp(@Req() request: Request, @Res() response: Response, @Body() body: SignUpUserDto): Promise<User | void> {
        console.log('UserController.signUp()', body, JSON.stringify(body));
        const {name, email, password} = request.body;
        console.log('req.body', request.body);
        admin.auth().createUser({
            email: email,
            password: password,
            displayName: name,
        })
            .then((userRecord) => {
                console.log('Successfully created new user:', userRecord.uid);
                response.redirect("/user/login");
            })
            .catch((error) => {
                console.log('Error creating new user:', error);
                response.redirect("/user/login");
            });
    }

    @Post('logout')
    async logout(@Req() request: Request, @Res() response: Response): Promise<User | void> {
        console.log('UserController.logout()');
        response.clearCookie("session");
        response.redirect("/user/login");
    }
}

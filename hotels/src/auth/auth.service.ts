import {
    Injectable, Req, Res,
    BadRequestException, NotFoundException, UnauthorizedException
}                                             from '@nestjs/common'
import { ConfigService }                      from "@nestjs/config"
import { InjectModel }                        from "@nestjs/mongoose"
import { JwtService }                         from '@nestjs/jwt'
import { WsException }                        from "@nestjs/websockets";
import { Request, Response }                  from "express"
import { Model }                              from "mongoose"
import { parse }                              from 'cookie'
import * as md5                               from "md5"
import { User, UserDocument }                 from "../user/schema/user.schema"
import { Role, SignUpUserDto, SignInUserDto } from "../user/dto/user.dto"
import { Socket }                             from "socket.io"

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
    }

    // create user
    async signUp(body: SignUpUserDto): Promise<UserDocument | any> {
        console.log('AuthService.signUp()', body)
        // const user = await this.userModel.findOne({email: body.email})
        // if (user)
        //     throw new BadRequestException('Email already exists');

        const fields = {...body, passwordHash: md5(body.password), role: Role.Client}
        delete fields.password
        const entity = new this.userModel(fields)
        return await entity.save()
    }

    // auth user (get login & pass, return token)
    // async signIn(@Req() request, @Res() response, body: SignInUserDto): Promise<any> {
    //     console.log('AuthService.signIn()', body, {user: request.user});
    //     const filter = {
    //         email: body.email,
    //         passwordHash: md5(body.password),
    //     };
    //     const entity = await this.userModel.findOne(filter);
    //     console.log(filter, entity)
    //     if (entity) {
    //         const payload = {
    //             id: entity._id.toString(),
    //             email: entity.email,
    //             contactPhone: entity.contactPhone,
    //         };
    //         return {
    //             access_token: this.jwtService.sign(payload),
    //         };
    //     }
    //     return false;
    // }

    async validateUser(email: string, password: string): Promise<Partial<UserDocument> | void> {
        console.log('AuthService.validateUser()', email, password)
        const user = await this.userModel.findOne({email: email})
        if (!user)
            throw new NotFoundException(`User ${email} not found`);
        if (user.passwordHash !== md5(password)) {
            throw new UnauthorizedException(`Wrong password for user ${email}`);
        }
        return {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
            role: user.role,
        };
    }

    async find(filter: SignInUserDto): Promise<UserDocument> {
        console.log('AuthService.find()', filter)
        return this.userModel.findOne(filter)
    }

    getLoginCookie(user) {
        console.log('AuthService.login()', user)
        const token = this.jwtService.sign(user);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    getLogoutCookie() {
        console.log('AuthService.logout()')
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`
    }

    async getUserFromSocket(socket: Socket) {
        console.log('AuthService.getUserFromSocket()')
        const cookie = socket.handshake.headers.cookie
        const {Authentication: authenticationToken} = parse(cookie)
        return await this.getUserFromAuthenticationToken(authenticationToken)
    }

    async getUserFromAuthenticationToken(token: string) {
        console.log('AuthService.getUserFromAuthenticationToken()', token)
        if (!token) return null
        try {
            return this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET')
            });
        } catch (e) {
            console.error(e)
            return null
        }
    }

}

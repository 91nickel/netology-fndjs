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
    UnauthorizedException,
    ForbiddenException,
    BadRequestException, NotFoundException, HttpCode,
}                                           from '@nestjs/common';
import { UserService }                                         from "./user.service";
import { Role, SignUpUserDto, SearchUserDto, RequestWithUser } from "./dto/user.dto";
import { JoiUserPipe }                                         from "../pipe/user.pipe";
import { CreateUserSchema, FindUserSchema } from "../joi/user.schema";
import { Request, Response }                from "express";
import { UserDocument }                     from "./schema/user.schema";

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {
    }

    @HttpCode(200)
    @Post('api/admin/users/')
    async createUser(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Body(new JoiUserPipe(CreateUserSchema)) body: SignUpUserDto
    ) {
        console.log('UserController.createUser', request.user);
        if (!request.user)
            throw new UnauthorizedException('You are not authorized')
        if (request.user.role !== Role.Admin)
            throw new ForbiddenException('Access denied')

        const user = await this.userService.findByEmail(body.email)
        if (user) {
            throw new BadRequestException(`User with email ${body.email} already registered`);
        }
        const result = await this.userService.create(body);
        result.id = result._id.toString();
        delete result._id;
        return response.send(result);
    }

    @HttpCode(200)
    @Get('api/:role/users/')
    async getUsers(
        @Req() request: RequestWithUser,
        @Res() response: Response,
        @Param('role') role: Role,
        @Query(new JoiUserPipe(FindUserSchema)) query: SearchUserDto
    ) {
        console.log('UserController.getUsers', role, query, request.user)

        if (role !== Role.Admin && role !== Role.Manager)
            throw new NotFoundException('Not found')
        if (!request.user)
            throw new UnauthorizedException('You must be authorized')
        if (role === Role.Admin && request.user.role !== Role.Admin)
            throw new ForbiddenException('You must be authorized as admin')
        if (role === Role.Manager && !(request.user.role === Role.Admin || request.user.role === Role.Manager))
            throw new ForbiddenException('You must be authorized as manager or admin')

        const dto = {
            limit: query.limit ? query.limit : 50,
            offset: query.offset ? query.offset : 0,
            name: query.name ? query.name : undefined,
            email: query.email ? query.email : undefined,
            contactPhone: query.contactPhone ? query.contactPhone : undefined,
        }
        const result = (await this.userService.findAll(dto)).map(el => {
            return {
                id: el._id.toString(),
                email: el.email,
                name: el.name,
                contactPhone: el.contactPhone
            }
        })

        return response.send(result);
    }

}

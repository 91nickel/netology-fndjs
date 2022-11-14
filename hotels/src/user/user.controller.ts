import {
  HttpCode,
  Controller,
  Body,
  Query,
  Param,
  Get,
  Post,
  Res,
  Req,
  ForbiddenException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import {
  Role,
  SignUpUserDto,
  SearchUserDto,
  RequestWithUser,
} from './dto/user.dto';
import { JoiUserPipe } from '../pipe/user.pipe';
import { CreateUserSchema, FindUserSchema } from '../joi/user.schema';
import RoleGuard from '../auth/guards/role.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(200)
  @Post('admin/users/')
  @UseGuards(RoleGuard(Role.Admin))
  async createUser(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body(new JoiUserPipe(CreateUserSchema)) body: SignUpUserDto,
  ) {
    const user = await this.userService.findByEmail(body.email);
    if (user) {
      throw new BadRequestException(
        `User with email ${body.email} already registered`,
      );
    }
    const result = await this.userService.create(body);
    result.id = result._id.toString();
    delete result._id;
    return response.send(result);
  }

  @HttpCode(200)
  @Get(':role/users/')
  @UseGuards(RoleGuard(Role.Manager, Role.Admin))
  async getUsers(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Param('role') role: Role,
    @Query(new JoiUserPipe(FindUserSchema)) query: SearchUserDto,
  ) {
    if (role === Role.Admin && request.user.role !== Role.Admin)
      throw new ForbiddenException('You must be authorized as admin');

    const dto = {
      limit: query.limit ? query.limit : 50,
      offset: query.offset ? query.offset : 0,
      name: query.name ? query.name : undefined,
      email: query.email ? query.email : undefined,
      contactPhone: query.contactPhone ? query.contactPhone : undefined,
    };
    const result = (await this.userService.findAll(dto)).map((el) => {
      return {
        id: el._id.toString(),
        email: el.email,
        name: el.name,
        contactPhone: el.contactPhone,
      };
    });

    return response.send(result);
  }
}

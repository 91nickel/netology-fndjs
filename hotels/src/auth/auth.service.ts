import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { parse } from 'cookie';
import * as md5 from 'md5';
import { Socket } from 'socket.io';
import { User, UserDocument } from '../user/schema/user.schema';
import { Role, SignUpUserDto, SignInUserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async signUp(body: SignUpUserDto): Promise<UserDocument | any> {
    const fields = {
      ...body,
      passwordHash: md5(body.password),
      role: Role.Client,
    };
    delete fields.password;
    const entity = new this.userModel(fields);
    return await entity.save();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Partial<UserDocument> | void> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new NotFoundException(`User ${email} not found`);
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
    return this.userModel.findOne(filter);
  }

  getLoginCookie(user) {
    const token = this.jwtService.sign(user);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }

  getLogoutCookie() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const { Authentication: authenticationToken } = parse(cookie);
    return await this.getUserFromAuthenticationToken(authenticationToken);
  }

  async getUserFromAuthenticationToken(token: string) {
    if (!token) return null;
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (e) {
      console.error(e);
      return null;
    }
  }
}

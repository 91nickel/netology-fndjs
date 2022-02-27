import {Injectable} from '@nestjs/common';
import {User, UserDocument} from "../users/schemas/user.schema";
import {JwtService} from '@nestjs/jwt';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {SignUpUserDto} from "../users/dto/sign-up-user.dto";
import {SignInUserDto} from "../users/dto/sign-in-user.dto";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private model: Model<UserDocument>,
        private jwtService: JwtService,
    ) {
    }

    // create user
    async signUp(body: SignUpUserDto): Promise<User | any> {
        console.log('AuthService.signUp()', body);
        const user = await this.model.findOne({email: body.email});
        if (user) {
            throw new Error('E-mail already exists');
        }
        const entity = new this.model(body);
        return await entity.save();
    }

    // auth user (get login & pass, return token)
    async signIn(body: SignInUserDto):Promise<any> {
        console.log('AuthService.signIn()', body);
        const entity = await this.model.findOne({email: body.email, password: body.password});
        if (entity) {
            return {
                id: entity._id.toString(),
                token: jwt.sign({id: entity._id, email: entity.email, firstName: entity.firstName}, process.env.JWT_SECRET_KEY),
            }
        }
        return false;
    }

    async validateUser(id: string): Promise<User | void> {
        console.log('AuthService.validate()', id);
        return this.model.findById(id);
    }

    async find (filter: SignInUserDto): Promise<UserDocument> {
        console.log('AuthService.find()', filter)
        return this.model.findOne(filter)
    }

}

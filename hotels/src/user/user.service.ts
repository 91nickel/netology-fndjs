import { Injectable }         from '@nestjs/common';
import { InjectModel }        from "@nestjs/mongoose";
import {
    Model, Schema as MongooseSchema
}                             from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { SearchUserDto }      from './dto/search-user.dto';
import { SignInUserDto }      from './dto/sign-in-user.dto';
import { SignUpUserDto }      from './dto/sign-up-user.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface IUserService {
    create(dto: SignUpUserDto): Promise<User>;

    findById(id: ID): Promise<User>;

    findByEmail(email: string): Promise<User>;

    findAll(params: SearchUserDto): Promise<User[]>;
}

@Injectable()
export class UserService implements IUserService {

    @InjectModel(User.name)
    private userModel: Model<UserDocument>

    async create(dto: SignUpUserDto): Promise<User> {
        console.log('UserService.create()', dto);
        try {
            const user = new this.userModel(dto);
            return await user.save();
        } catch (error) {
            console.error(error)
        }
    }

    async findById(id: ID): Promise<User> {
        console.log('UserService.findById()', id);
        try {
            const book = await this.userModel.findById(id);
            console.log(book)
            return book;
        } catch (error) {
            console.error(error)
        }
    }

    async findByEmail(email: string): Promise<User> {
        console.log('UserService.findByEmail()...');
        try {
            const user = await this.userModel.findOne({email: email}).exec();
            console.log(user);
            return user;
        } catch (error) {
            console.error(error)
        }
    }

    async findAll(dto: SearchUserDto): Promise<User[]> {
        console.log('UserService.findAll()...');
        try {
            if (dto.name)
                dto.name = `/${dto.name}/i`;
            if (dto.email)
                dto.email = `/${dto.email}/i`;
            if (dto.contactPhone)
                dto.contactPhone = `/${dto.contactPhone}/i`;
            const users = await this.userModel.find(dto).exec();
            console.log(users);
            return users;
        } catch (error) {
            console.error(error)
        }
    }

}

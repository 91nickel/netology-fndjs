import { Injectable }                                            from '@nestjs/common';
import { InjectModel }                                           from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema }                       from 'mongoose';
import * as md5                                                  from 'md5';
import { User, UserDocument }                                    from './schema/user.schema';
import { Role, SearchUserDto, SearchUserParams, SignUpUserDto, } from './dto/user.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface IUserService {
    create(data: Partial<UserDocument>): Promise<UserDocument>;

    findById(id: ID): Promise<UserDocument>;

    findByEmail(email: string): Promise<UserDocument>;

    findAll(params: SearchUserParams): Promise<UserDocument[]>;
}

@Injectable()
export class UserService implements IUserService {

    @InjectModel(User.name)
    private userModel: Model<UserDocument>;

    create(data: SignUpUserDto): Promise<UserDocument> {
        try {
            const fields = {
                ...data,
                passwordHash: md5(data.password),
                role: Role.Client,
            };
            delete fields.password;
            const entity = new this.userModel(fields);
            return entity.save();
        } catch (error) {
            console.error(error);
        }
    }

    findById(id: ID): Promise<UserDocument> {
        try {
            return this.userModel.findById(id).exec();
        } catch (error) {
            console.error(error);
        }
    }

    findByEmail(email: string): Promise<UserDocument> {
        try {
            return this.userModel.findOne({email: email}).exec();
        } catch (error) {
            console.error(error);
        }
    }

    findAll(params: SearchUserDto): Promise<UserDocument[]> {
        try {
            const filter: Partial<SearchUserDto> = {};
            if (params.name) filter.name = `/${params.name}/i`;
            if (params.name) filter.email = `/${params.email}/i`;
            if (params.name) filter.contactPhone = `/${params.contactPhone}/i`;
            return this.userModel
                .find(filter)
                .limit(params.limit)
                .skip(params.offset)
                .exec();
        } catch (error) {
            console.error(error);
        }
    }

    async findOrCreate(params, profile, cb): Promise<UserDocument> {
        let user: UserDocument = await this.userModel.findOne(params).exec()
        if (!user) {
            user = await this.create({
                email: profile.username,
                password: '123456',
                name: profile._json.first_name,
                contactPhone: profile._json.default_phone.number,
                role: Role.Client,
            })
        }
        return cb(null, {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            contactPhone: user.contactPhone,
            role: user.role,
        })
    }

}

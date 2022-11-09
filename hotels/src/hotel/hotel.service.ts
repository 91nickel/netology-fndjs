import { Injectable }                      from '@nestjs/common';
import { Hotel, HotelDocument }            from './schema/hotel.schema';
import { Model, Schema as MongooseSchema } from "mongoose";
import { CreateHotelDto, SearchHotelsDto } from './dto/hotel.dto'
import { InjectModel }                     from "@nestjs/mongoose";
import { Request }                         from "express";
import { UserDocument }                    from "../user/schema/user.schema";

type ID = string | MongooseSchema.Types.ObjectId;

interface IHotelService {
    create(data: any): Promise<HotelDocument>;

    findById(id: ID): Promise<HotelDocument>;

    search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]>;
}

@Injectable()
export class HotelService implements IHotelService {

    @InjectModel(Hotel.name)
    private hotelModel: Model<HotelDocument>

    create(data: CreateHotelDto): Promise<HotelDocument> {
        console.log('HotelService.create()', data)
        try {
            return (new this.hotelModel(data)).save()
        } catch (error) {
            console.error(error)
        }
    }

    findById(id: ID): Promise<HotelDocument> {
        console.log('HotelService.findById()', id);
        try {
            return this.hotelModel.findById(id).exec();
        } catch (error) {
            console.error(error)
        }
    }

    search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]> {
        console.log('HotelService.search()', params);
        try {
            return this.hotelModel.find(params).exec()
        } catch (error) {
            console.error(error)
        }
    }

    async find(filter: any, limit = 50, offset = 0): Promise<HotelDocument[]> {
        console.log('HotelService.find()', filter);
        try {
            return await this.hotelModel.find(filter).limit(limit).skip(offset).exec();
        } catch (error) {
            console.error(error)
        }
    }

}

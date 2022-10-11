import { Injectable }                      from '@nestjs/common';
import { Hotel, HotelDocument }            from './schema/hotel.schema';
import { Model, Schema as MongooseSchema } from "mongoose";
import { CreateHotelDto }                  from './dto/create-hotel.dto'
import { InjectModel }                     from "@nestjs/mongoose";

type ID = string | MongooseSchema.Types.ObjectId;

interface IHotelService {
    create(dto: CreateHotelDto): Promise<Hotel>;

    findById(id: ID): Promise<Hotel>;

    search(params: Pick<Hotel, "title">): Promise<Hotel[]>;
}

@Injectable()
export class HotelService implements IHotelService {

    @InjectModel(Hotel.name)
    private hotelModel: Model<HotelDocument>

    async create(dto: CreateHotelDto): Promise<Hotel> {
        console.log('HotelService.create()', dto);
        try {
            const hotel = new this.hotelModel(dto);
            return await hotel.save();
        } catch (error) {
            console.error(error)
        }
    }

    async findById(id: ID): Promise<Hotel> {
        console.log('HotelService.findById()', id);
        try {
            const hotel = await this.hotelModel.findById(id);
            console.log(hotel)
            return hotel;
        } catch (error) {
            console.error(error)
        }
    }

    async search(params: Pick<Hotel, "title">): Promise<Hotel[]> {
        console.log('HotelService.search()', params);
        try {
            const hotels = await this.hotelModel.find({title: params.title});
            console.log(hotels)
            return hotels;
        } catch (error) {
            console.error(error)
        }
    }
}

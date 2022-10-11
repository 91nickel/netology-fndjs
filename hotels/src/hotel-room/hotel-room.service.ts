import { Injectable }                      from '@nestjs/common';
import { Model, Schema as MongooseSchema } from "mongoose";
import { HotelRoom, HotelRoomDocument }    from './schema/hotel-room.schema';
import { CreateHotelRoomDto }              from './dto/create-hotel-room.dto';
import { SearchHotelRoomDto }              from './dto/search-hotel-room.dto';
import { InjectModel }                     from "@nestjs/mongoose";

type ID = string | MongooseSchema.Types.ObjectId;

interface IHotelRoomService {
    create(dto: CreateHotelRoomDto): Promise<HotelRoom>;

    findById(id: ID, isEnabled?: true): Promise<HotelRoom>;

    search(dto: SearchHotelRoomDto): Promise<HotelRoom[]>;

    update(id: ID, data: Partial<CreateHotelRoomDto>): Promise<HotelRoom>;
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {

    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>

    async create(dto: CreateHotelRoomDto): Promise<HotelRoom> {
        console.log('HotelRoomService.create()', dto);
        try {
            const hotelRoom = await (new this.hotelRoomModel(dto)).save();
            console.log(hotelRoom)
            return hotelRoom;
        } catch (e) {
            console.error(e);
        }
    }

    async findById(id: ID, isEnabled?: true): Promise<HotelRoom> {
        console.log('HotelRoomService.findById()', id, isEnabled);
        try {
            const searchParams: {_id: ID, isEnabled?: true} = {_id: id};
            if (isEnabled)
                searchParams.isEnabled = true;
            const hotelRoom = await this.hotelRoomModel.findOne(searchParams).exec();
            console.log(hotelRoom)
            return hotelRoom;
        } catch (e) {
            console.error(e);
        }
    }

    async search(dto: SearchHotelRoomDto): Promise<HotelRoom[]> {
        console.log('HotelRoomService.search()');
        try {
            const hotelRooms = await this.hotelRoomModel.find(dto).exec();
            console.log(hotelRooms)
            return hotelRooms;
        } catch (e) {
            console.error(e);
        }
    }

    async update(id: ID, dto: Pick<CreateHotelRoomDto, 'title' | 'description' | 'images' | 'isEnabled'>): Promise<HotelRoom> {
        console.log('HotelRoomService.update()');
        try {
            const hotelRoom = await this.hotelRoomModel.findByIdAndUpdate(id, dto).exec();
            console.log(hotelRoom)
            return hotelRoom;
        } catch (e) {
            console.error(e);
        }
    }

}

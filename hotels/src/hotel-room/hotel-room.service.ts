import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './schema/hotel-room.schema';
import {
  CreateHotelRoomDto,
  SearchHotelRoomsDto,
  SearchRoomsParams,
} from './dto/hotel-room.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface IHotelRoomService {
  create(data: Partial<HotelRoomDocument>): Promise<HotelRoomDocument>;

  findById(id: ID, isEnabled?: true): Promise<HotelRoomDocument>;

  search(params: SearchRoomsParams): Promise<HotelRoomDocument[]>;

  update(id: ID, data: Partial<HotelRoomDocument>): Promise<HotelRoomDocument>;
}

@Injectable()
export class HotelRoomService implements IHotelRoomService {
  @InjectModel(HotelRoom.name)
  private hotelRoomModel: Model<HotelRoomDocument>;

  create(data: CreateHotelRoomDto): Promise<HotelRoomDocument> {
    try {
      return new this.hotelRoomModel(data).save();
    } catch (e) {
      console.error(e);
    }
  }

  findById(id: ID, isEnabled?: true): Promise<HotelRoomDocument> {
    try {
      const filter: any = { _id: id };
      if (isEnabled) filter.isEnabled = true;
      return this.hotelRoomModel.findOne(filter).exec();
    } catch (e) {
      console.error(e);
    }
  }

  search(params: SearchHotelRoomsDto): Promise<HotelRoomDocument[]> {
    try {
      const filter: any = { hotel: params.hotel };
      if (params.isEnabled) filter.isEnabled = true;
      return this.hotelRoomModel
        .find(filter)
        .limit(params.limit)
        .skip(params.offset)
        .exec();
    } catch (e) {
      console.error(e);
    }
  }

  async update(
    id: ID,
    data: Partial<CreateHotelRoomDto>,
  ): Promise<HotelRoomDocument> {
    try {
      return this.hotelRoomModel.findByIdAndUpdate(id, data).exec();
    } catch (e) {
      console.error(e);
    }
  }

  find(filter: any): Promise<HotelRoomDocument[]> {
    try {
      return this.hotelRoomModel.find(filter).exec();
    } catch (e) {
      console.error(e);
    }
  }
}

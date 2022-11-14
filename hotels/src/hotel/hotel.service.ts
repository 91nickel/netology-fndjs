import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Hotel, HotelDocument } from './schema/hotel.schema';
import { CreateHotelDto, UpdateHotelParams } from './dto/hotel.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface IHotelService {
  create(data: any): Promise<HotelDocument>;

  findById(id: ID): Promise<HotelDocument>;

  search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]>;

  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}

@Injectable()
export class HotelService implements IHotelService {
  @InjectModel(Hotel.name)
  private hotelModel: Model<HotelDocument>;

  create(data: CreateHotelDto): Promise<HotelDocument> {
    try {
      return new this.hotelModel(data).save();
    } catch (error) {
      console.error(error);
    }
  }

  findById(id: ID): Promise<HotelDocument> {
    try {
      return this.hotelModel.findById(id).exec();
    } catch (error) {
      console.error(error);
    }
  }

  search(params: Pick<HotelDocument, 'title'>): Promise<HotelDocument[]> {
    try {
      return this.hotelModel.find(params).exec();
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
    try {
      await this.hotelModel.findByIdAndUpdate(id, data);
      return this.hotelModel.findById(id);
    } catch (error) {
      console.error(error);
    }
  }

  async find(filter: any, limit = 50, offset = 0): Promise<HotelDocument[]> {
    try {
      return await this.hotelModel
        .find(filter)
        .limit(limit)
        .skip(offset)
        .exec();
    } catch (error) {
      console.error(error);
    }
  }
}

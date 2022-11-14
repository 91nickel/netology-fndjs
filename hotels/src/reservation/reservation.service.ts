import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Reservation, ReservationDocument } from './schema/reservation.schema';
import {
  CreateReservationDto,
  ReservationDto,
  ReservationSearchOptions,
  SearchReservationDto,
} from './dto/reservation.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface IReservation {
  addReservation(data: ReservationDto): Promise<ReservationDocument>;

  removeReservation(id: ID): Promise<void>;

  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<ReservationDocument>>;
}

@Injectable()
export class ReservationService implements IReservation {
  @InjectModel(Reservation.name)
  private reservationModel: Model<ReservationDocument>;

  async addReservation(
    dto: CreateReservationDto,
  ): Promise<ReservationDocument> {
    try {
      const filter = {
        dateStart: {
          $gte: `${dto.dateStart.getFullYear()}-${
            dto.dateStart.getMonth() + 1
          }-${dto.dateStart.getDate()}`,
        },
        dateEnd: {
          $lte: `${dto.dateEnd.getFullYear()}-${
            dto.dateEnd.getMonth() + 1
          }-${dto.dateEnd.getDate()}`,
        },
        roomId: dto.room,
      };
      const sameReservations = await this.reservationModel.find(filter);

      if (sameReservations.length)
        throw new BadRequestException('Room is reserved on this dates');

      const fields: Partial<ReservationDocument> = {
        userId: dto.user,
        hotelId: dto.hotel,
        roomId: dto.room,
        dateStart: dto.dateStart,
        dateEnd: dto.dateEnd,
      };

      return new this.reservationModel(fields).save();
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  removeReservation(id: ID): Promise<void> {
    try {
      return this.reservationModel
        .findByIdAndRemove(id)
        .exec()
        .then(() => {});
    } catch (e) {
      console.error(e);
    }
  }

  getReservations(dto: SearchReservationDto): Promise<ReservationDocument[]> {
    try {
      const filter: any = {};
      if (dto.dateStart)
        filter.dateStart = {
          $gte: `${dto.dateStart.getFullYear()}-${
            dto.dateStart.getMonth() + 1
          }-${dto.dateStart.getDate()}`,
        };
      if (dto.dateEnd)
        filter.dateEnd = {
          $lte: `${dto.dateEnd.getFullYear()}-${
            dto.dateEnd.getMonth() + 1
          }-${dto.dateEnd.getDate()}`,
        };
      if (dto.user) filter.userId = dto.user;
      if (dto.hotel) filter.hotelId = dto.hotel;
      if (dto.room) filter.roomId = dto.room;
      return this.reservationModel.find(filter).exec();
    } catch (e) {
      console.error(e);
    }
  }

  findById(id: ID): Promise<ReservationDocument> {
    try {
      return this.reservationModel.findById(id).exec();
    } catch (e) {
      console.error(e);
    }
  }
}

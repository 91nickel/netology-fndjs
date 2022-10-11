import { Injectable }                       from '@nestjs/common';
import { InjectModel }                      from "@nestjs/mongoose";
import { Model, Schema as MongooseSchema }  from 'mongoose';
import { Reservation, ReservationDocument } from './schema/reservation.schema';
import { CreateReservationDto }             from './dto/create-reservation.dto';
import { SearchReservationDto }             from './dto/search-reservation.dto';

type ID = string | MongooseSchema.Types.ObjectId;

interface IReservation {
    addReservation(dto: CreateReservationDto): Promise<Reservation>;

    removeReservation(id: ID): Promise<void>;

    getReservations(dto: SearchReservationDto): Promise<Array<Reservation>>;
}

@Injectable()
export class ReservationService {
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>

    async addReservation(dto: CreateReservationDto): Promise<Reservation> {
        console.log('ReservationService.addReservation()')
        try {
            const reservation = await (new this.reservationModel(dto)).save()
            console.log(reservation)
            return reservation
        } catch (e) {
            console.error(e)
        }
    }

    async removeReservation(id: ID): Promise<void> {
        console.log('ReservationService.removeReservation()')
        try {
            const reservation = await this.reservationModel.findByIdAndRemove(id).exec()
            console.log(reservation)
        } catch (e) {
            console.error(e)
        }
    }

    async getReservations(dto: SearchReservationDto): Promise<Reservation[]> {
        console.log('ReservationService.getReservations()')
        try {
            const reservations = await this.reservationModel.find(dto).exec()
            console.log(reservations)
            return reservations
        } catch (e) {
            console.error(e)
        }
    }
}

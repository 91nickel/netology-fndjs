import * as Joi from 'joi';

export const CreateReservationSchema = Joi.object().keys({
    hotelRoom: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
})

export const UpdateReservationSchema = Joi.object().keys({
    user: Joi.string().optional(),
    hotel: Joi.string().optional(),
    room: Joi.string().optional(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().optional(),
})

export const SearchReservationSchema = Joi.object().keys({
    user: Joi.string().optional(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().optional(),
})
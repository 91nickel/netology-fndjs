import * as Joi from 'joi';

export const CreateReservationSchema = Joi.object().keys({
  hotelRoom: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

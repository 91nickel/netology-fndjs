import * as Joi from 'joi';

export const CreateHotelRoomSchema = Joi.object().keys({
  hotelId: Joi.string().required(),
  description: Joi.string().optional(),
  isEnabled: Joi.boolean().optional(),
});

export const UpdateHotelRoomSchema = Joi.object().keys({
  description: Joi.string().optional(),
  hotelId: Joi.string().optional(),
  images: Joi.array().optional(),
  isEnabled: Joi.boolean().optional(),
});

export const FindHotelRoomsSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  hotel: Joi.string().required(),
});

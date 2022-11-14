import * as Joi from 'joi';

export const CreateHotelSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().optional(),
});

export const UpdateHotelSchema = Joi.object().keys({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
});

export const FindHotelsSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
});

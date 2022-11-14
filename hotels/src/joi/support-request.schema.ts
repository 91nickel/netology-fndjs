import * as Joi from 'joi';

export const CreateSupportRequestSchema = Joi.object().keys({
  text: Joi.string().required(),
});

export const MarkMessageAsReadSchema = Joi.object().keys({
  createdBefore: Joi.date().required(),
});

export const FindSupportRequestSchema = Joi.object().keys({
  isActive: Joi.boolean().optional(),
  limit: Joi.string().optional(),
  offset: Joi.string().optional(),
});

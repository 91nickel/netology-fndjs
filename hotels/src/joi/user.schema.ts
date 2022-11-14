import * as Joi from 'joi';
import { Role } from '../user/dto/user.dto';

export const CreateUserSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required(),
  contactPhone: Joi.string()
    .regex(/\+\d{11}/)
    .required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .optional(),
});

export const FindUserSchema = Joi.object().keys({
  limit: Joi.number().optional(),
  offset: Joi.number().optional(),
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  contactPhone: Joi.string()
    .regex(/\+\d{11}/)
    .optional(),
});

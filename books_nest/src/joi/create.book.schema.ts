import * as Joi from 'joi';

const CreateBookSchema = Joi.object().keys({
    title: Joi.string().min(2).max(100).optional(),
    description: Joi.string().min(2).max(100).optional(),
})

export {CreateBookSchema}
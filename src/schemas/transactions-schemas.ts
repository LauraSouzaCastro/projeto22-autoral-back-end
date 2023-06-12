import Joi from 'joi';

export const transationsSchema = Joi.object<any>({
    typeTransaction: Joi.string().required(),
    value: Joi.number().min(0.01).required(),
    categoryName: Joi.string().required(),
    color: Joi.string().regex(/^#[A-Fa-f0-9]{6}/).required(),
    dateTransaction: Joi.date().required(),
    done: Joi.boolean().required(),
    categoryId: Joi.number().allow(null, 0),
});
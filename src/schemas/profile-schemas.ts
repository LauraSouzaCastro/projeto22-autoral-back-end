import Joi from 'joi';

export const createProfileSchema = Joi.object<any>({
  name: Joi.string().required(),
});
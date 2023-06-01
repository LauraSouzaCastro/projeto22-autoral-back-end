import Joi from 'joi';

export const updateProfileSchema = Joi.object<any>({
  name: Joi.string().required(),
});
import Joi from 'joi';
import { CreateUserParams } from '@/services/users-service';

export const createUserSchema = Joi.object<CreateUserParams>({
  name: Joi.string().required(),
  image: Joi.string().uri().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

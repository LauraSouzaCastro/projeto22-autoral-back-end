import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { duplicatedEmailError } from '@/errors/duplicated-email-error';
import userRepository from '@/repositories/user-repository';

export async function createUser({ name, image, email, password }: CreateUserParams): Promise<User> {
  
  await validateUniqueEmailOrFail(email);

  const hashedPassword = await bcrypt.hash(password, 12);
  return userRepository.create({
    name,
    image,
    email,
    password: hashedPassword,
  });
}

async function validateUniqueEmailOrFail(email: string): Promise<void> {
  const userWithSameEmail = await userRepository.findByEmail(email);
  if (userWithSameEmail) {
    throw duplicatedEmailError();
  }
}

export type CreateUserParams = Pick<User, 'name' | 'image' | 'email' | 'password'>;

const userService = {
  createUser,
};

export default userService;

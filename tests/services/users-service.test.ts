import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { createUser as createUserSeed } from '../factories';
import { cleanDb } from '../helpers';
import userService from '@/services/users-service';
import { prisma } from '@/config';
import { init } from '@/app';
import { duplicatedEmailError } from '@/errors/duplicated-email-error';

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('createUser', () => {
  it('should throw duplicatedUserError if there is a user with given email', async () => {
    const existingUser = await createUserSeed();

    try {
      await userService.createUser({
        email: existingUser.email,
        password: faker.internet.password(6),
        image: 'https://avatars.githubusercontent.com/u/115507473?v=4',
        name: 'Laura',
      });
      fail('should throw duplicatedUserError');
    } catch (error) {
      expect(error).toEqual(duplicatedEmailError());
    }
  });

  it('should create user when given email is unique', async () => {
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: faker.internet.password(6),
      image: 'https://avatars.githubusercontent.com/u/115507473?v=4',
      name: 'Laura',
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(user).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        email: dbUser.email,
      }),
    );
  });

  it('should hash user password', async () => {
    const rawPassword = faker.internet.password(6);
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: rawPassword,
      image: 'https://avatars.githubusercontent.com/u/115507473?v=4',
      name: 'Laura',
    });

    const dbUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    expect(dbUser.password).not.toBe(rawPassword);
    expect(await bcrypt.compare(rawPassword, dbUser.password)).toBe(true);
  });
});

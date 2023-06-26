import { faker } from '@faker-js/faker';
import { cleanDb } from '../helpers';
import userService from '../../src/services/users-service';
import { prisma } from '../../src/config';
import { init } from '../../src/app';
import profileService from '../../src/services/profile-service';
import { notFoundError } from '../../src/errors';

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('updateUserImage', () => {
  it('should throw notFoundError if there is no user with given userid', async () => {
    try {
      await profileService.updateUserImage({
        userId: faker.number.int(3),
        image: faker.internet.url(),
      });
      fail('should throw notFoundError');
    } catch (error) {
      expect(error).toEqual(notFoundError());
    }
  });

  it('should update user when given userId is valid', async () => {
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    const userUpdate = await profileService.updateUserImage({
        userId: user.id,
        image: faker.internet.url(),
    });

    const dbUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
    });
    expect(userUpdate).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        image: dbUser.image,
      }),
    );
  });
});

describe('updateUserName', () => {
  it('should throw notFoundError if there is no user with given userid', async () => {
    try {
      await profileService.updateUserName({
        userId: faker.number.int(3),
        name: faker.person.firstName(),
      });
      fail('should throw notFoundError');
    } catch (error) {
      expect(error).toEqual(notFoundError());
    }
  });

  it('should update user when given userId is valid', async () => {
    const user = await userService.createUser({
      email: faker.internet.email(),
      password: faker.internet.password(6),
    });

    const userUpdate = await profileService.updateUserName({
        userId: user.id,
        name: faker.person.firstName(),
    });

    const dbUser = await prisma.user.findUnique({
        where: {
          id: user.id,
        },
    });
    expect(userUpdate).toEqual(
      expect.objectContaining({
        id: dbUser.id,
        name: dbUser.name,
      }),
    );
  });
});
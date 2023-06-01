import { faker } from '@faker-js/faker';
import { cleanDb } from '../helpers';
import userService from '@/services/users-service';
import { prisma } from '@/config';
import { init } from '@/app';
import profileService from '@/services/profile-service';
import { notFoundError } from '@/errors';

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('updateUser', () => {
  it('should throw notFoundError if there is no user with given userid', async () => {
    try {
      await profileService.updateUser({
        userId: faker.number.int(3),
        name: faker.person.firstName(),
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

    const userUpdate = await profileService.updateUser({
        userId: user.id,
        name: faker.person.firstName(),
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
        name: dbUser.name,
        image: dbUser.image,
      }),
    );
  });
});

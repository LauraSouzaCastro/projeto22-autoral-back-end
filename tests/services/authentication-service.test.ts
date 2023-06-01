import { faker } from '@faker-js/faker';
import { createUser } from '../factories';
import { cleanDb } from '../helpers';
import { init } from '@/app';
import { prisma } from '@/config';
import authenticationService from '@/services/authentication-service';
import { invalidCredentialsError } from '@/errors/invalid-credentials-error';
import { notFoundError } from '@/errors';

beforeAll(async () => {
  await init();
  await cleanDb();
});

describe('signIn', () => {
  const generateParams = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(6),
  });

  it('should throw InvalidCredentialError if there is no user for given email', async () => {
    const params = generateParams();

    try {
      await authenticationService.signIn(params);
      fail('should throw InvalidCredentialError');
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  it('should throw InvalidCredentialError if given password is invalid', async () => {
    const params = generateParams();
    await createUser({
      email: params.email,
      password: 'invalid-password',
    });

    try {
      await authenticationService.signIn(params);
      fail('should throw InvalidCredentialError');
    } catch (error) {
      expect(error).toEqual(invalidCredentialsError());
    }
  });

  describe('when email and password are valid', () => {
    it('should return user data if given email and password are valid', async () => {
      const params = generateParams();
      const user = await createUser(params);

      const { user: signInUser } = await authenticationService.signIn(params);
      expect(user).toEqual(
        expect.objectContaining({
          id: signInUser.id,
          email: signInUser.email,
        }),
      );
    });

    it('should create new session and return given token', async () => {
      const params = generateParams();
      const user = await createUser(params);

      const { token: createdSessionToken } = await authenticationService.signIn(params);

      expect(createdSessionToken).toBeDefined();
      const session = await prisma.session.findFirst({
        where: {
          token: createdSessionToken,
          userId: user.id,
        },
      });
      expect(session).toBeDefined();
    });
  });
});

describe('findByUserId', () => {
  const generateParams = () => ({
    email: faker.internet.email(),
    password: faker.internet.password(6),
  });

  describe('when email and password are valid', () => {
    it('should throw NotFound Error if there is no token for given user', async () => {
      const params = generateParams();
      const user = await createUser(params);

      try {
        await authenticationService.findByUserId(user.id);
        fail('should throw NotFoundError');
      } catch (error) {
        expect(error).toEqual(notFoundError());
      }
    });
  });

  it('should return a user token array', async () => {
    const params = generateParams();
    const user = await createUser(params);

    await authenticationService.signIn(params);
    const sessions = await authenticationService.findByUserId(user.id);

    expect(sessions).toBeDefined();
  });
});

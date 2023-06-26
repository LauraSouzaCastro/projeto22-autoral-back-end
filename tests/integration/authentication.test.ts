import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '../../src/app';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../../src/config';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe('POST /auth/sign-in', () => {
  it('should respond with status 400 when body is not given', async () => {
    const response = await server.post('/auth/sign-in');

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/auth/sign-in').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe('when body is valid', () => {
    const generateValidBody = () => ({
      email: faker.internet.email(),
      password: faker.internet.password(6)
    });

    it('should respond with status 401 if there is no user for given email', async () => {
      const body = generateValidBody();

      const response = await server.post('/auth/sign-in').send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post('/auth/sign-in').send({
        ...body,
        password: faker.lorem.word(),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when credentials are valid', () => {
      it('should respond with status 200', async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post('/auth/sign-in').send(body);

        expect(response.status).toBe(httpStatus.OK);
      });

      it('should respond with user data', async () => {
        const body = generateValidBody();
        const user = await createUser(body);

        const response = await server.post('/auth/sign-in').send(body);

        expect(response.body.user).toEqual({
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        });
      });

      it('should respond with session token', async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post('/auth/sign-in').send(body);

        expect(response.body.token).toBeDefined();
      });
    });
  });
});

describe('GET /auth/sessions', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/auth/sessions');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/auth/sessions').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/auth/sessions').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 with a non-sessed user', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);

      const response = await server.get('/auth/sessions').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 200 with a valid token', async () => {
      const user = await createUser();
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      await prisma.session.create({
        data: {
          token: token,
          userId: user.id,
        },
      });

      const response = await server.get('/auth/sessions').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.OK);

      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          userId: expect.any(Number),
          token: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ]);
    });
  });
});

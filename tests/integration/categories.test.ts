import { faker } from '../../node_modules/@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createTransaction, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '../../src/app';
import * as jwt from 'jsonwebtoken';

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('GET /categories/', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/categories');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/categories').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/categories').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 200 and categories by user', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            await createTransaction(user.id, 'OUTPUT');

            const response = await server
                .get('/categories')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([{
                color: expect.any(String),
                createdAt: expect.any(String),
                id: expect.any(Number),
                name: expect.any(String),
                updatedAt: expect.any(String),
                userId: expect.any(Number),
            }]);
        });
    });
});
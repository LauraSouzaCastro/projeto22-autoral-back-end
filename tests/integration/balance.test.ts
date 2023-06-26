import { faker } from '@faker-js/faker';
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

describe('GET /balance/', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/balance');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/balance').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/balance').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 200 and balance empty by user when there is no balance', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .get('/balance')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({ value: 0.00 });
        });

        it('should respond with status 200 and balance by user', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            await createTransaction(user.id, 'INPUT');

            const response = await server
                .get('/balance')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual({ value: expect.any(String) });
        });
    });
});
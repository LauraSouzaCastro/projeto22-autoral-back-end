import { faker } from '@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createTransaction, createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import * as jwt from 'jsonwebtoken';

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('POST /transactions/', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/transactions');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/transactions').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/transactions').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 201 with a valid body', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const data = {
                typeTransaction: 'INPUT',
                value: 1,
                categoryName: faker.string.alphanumeric(),
                color: faker.color.rgb(),
                dateTransaction: faker.date.recent(),
                done: true,
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);


            expect(response.status).toEqual(httpStatus.CREATED);
        });

        it('should respond with status 400 with invalid typeTransaction', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const data = {
                typeTransaction: '',
                value: 300,
                categoryName: faker.string.alphanumeric(),
                color: faker.color.rgb(),
                dateTransaction: faker.date.recent(),
                done: true,
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 with invalid value', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const data = {
                typeTransaction: 'INPUT',
                value: 0,
                categoryName: faker.string.alphanumeric(),
                color: faker.color.rgb(),
                dateTransaction: faker.date.recent(),
                done: true,
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 with invalid categoryName', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const data = {
                typeTransaction: 'INPUT',
                value: 1,
                categoryName: '',
                color: faker.color.rgb(),
                dateTransaction: faker.date.recent(),
                done: true,
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 with invalid color', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const data = {
                typeTransaction: 'INPUT',
                value: 1,
                categoryName: faker.string.alphanumeric(),
                color: '',
                dateTransaction: faker.date.recent(),
                done: true,
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 with invalid dateTransaction', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const data = {
                typeTransaction: 'INPUT',
                value: 1,
                categoryName: faker.string.alphanumeric(),
                color: faker.color.rgb(),
                dateTransaction: '',
                done: true,
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 400 with invalid done', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const data = {
                typeTransaction: 'INPUT',
                value: 1,
                categoryName: faker.string.alphanumeric(),
                color: faker.color.rgb(),
                dateTransaction: faker.date.recent(),
                done: '',
                categoryId: 0,
            }
            const response = await server
                .post('/transactions')
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });
    });
});

describe('GET /transactions/', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/transactions');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/transactions').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/transactions').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 200 and empty array when there are no transactions', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .get('/transactions')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([]);
        });

        it('should respond with status 200 and transactions array when there are transactions', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            await createTransaction(user.id, 'OUTPUT');

            const response = await server
                .get('/transactions')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([{
                Category: {
                    name: expect.any(String),
                },
                dateTransaction: expect.any(String),
                id: expect.any(Number),
                value: expect.any(String),
            }]);
        });
    });
});

describe('DELETE /transactions/:transactionId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.delete('/transactions/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.delete('/transactions/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.delete('/transactions/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 400 with invalid transactionId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .delete('/transactions/0')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

        it('should respond with status 404 when there are no transactionId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .delete('/transactions/1')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 when there are valid transactionsId', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const transaction = await createTransaction(user.id, 'INPUT');

            const response = await server
                .delete(`/transactions/${transaction.id}`)
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);

        });
    });
});

describe('GET /transactions/data', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/transactions/data');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/transactions/data').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/transactions/data').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 200 and empty array when there are no transactions', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .get('/transactions/data')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([]);
        });

        it('should respond with status 200 and transactions array when there are transactions', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            await createTransaction(user.id, 'INPUT');

            const response = await server
                .get('/transactions/data')
                .set('Authorization', `Bearer ${token}`);


            expect(response.status).toEqual(httpStatus.OK);
            expect(response.body).toEqual([{
                color: expect.any(String),
                data: [
                    {
                        x: expect.any(String),
                        y: expect.any(String),
                    },
                ],
                name: expect.any(String),
                type: expect.any(String),
            },
            {
                color: expect.any(String),
                data: [{
                    x: expect.any(String),
                    y: expect.any(String),
                }],
                name: expect.any(String),
                type: expect.any(String),
            },]);
        });
    });
});
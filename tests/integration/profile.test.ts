import { faker } from '../../node_modules/@faker-js/faker';
import httpStatus from 'http-status';
import supertest from 'supertest';
import { createUser } from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '../../src/app';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../../src/config';
import path from 'path';

beforeAll(async () => {
    await init();
    await cleanDb();
});

const server = supertest(app);

describe('PUT /profile/image', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/profile/image');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put('/profile/image').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/profile/image').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when ivalid user ', async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
            await prisma.session.create({
                data: {
                    token: token,
                    userId: user.id,
                },
            });
            const response = await server
                .put('/profile/image')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .attach('image', path.resolve(__dirname, '..', '..', 'uploads/f8c6968a3e86-Hubble-Ultra-Deep-Field-640x640.jpg'));


            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 with a valid body', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .put('/profile/image')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .attach('image', path.resolve(__dirname, '..', '..', 'uploads/f8c6968a3e86-Hubble-Ultra-Deep-Field-640x640.jpg'));


            expect(response.status).toEqual(httpStatus.OK);
        });

        it('should respond with status 400 with a invalid image', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .put('/profile/image')
                .set('Authorization', `Bearer ${token}`)
                .set('Content-Type', 'multipart/form-data')
                .field('name', faker.person.firstName())
                .attach('image', '');

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });

    });
});

describe('PUT /profile/name', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/profile/name');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.put('/profile/name').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.put('/profile/name').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when ivalid user ', async () => {
            const user = await createUser();
            const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
            await prisma.session.create({
                data: {
                    token: token,
                    userId: user.id,
                },
            });
            const response = await server
                .put('/profile/name')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: faker.person.firstName()});


            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 200 with a valid body', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .put('/profile/name')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: faker.person.firstName()});


            expect(response.status).toEqual(httpStatus.OK);
        });

        it('should respond with status 400 with invalid name', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server
                .put('/profile/name')
                .set('Authorization', `Bearer ${token}`)
                .send({ name: ''});

            expect(response.status).toEqual(httpStatus.BAD_REQUEST);
        });
    });
});

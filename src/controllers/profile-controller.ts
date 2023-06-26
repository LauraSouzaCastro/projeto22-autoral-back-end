import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import profileService from '../services/profile-service';
import { JwtPayload } from 'jsonwebtoken';
import { badRequestError } from '../errors/bad-request-error';

export async function imagePut(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req as JwtPayload;
        try{
            req.file.filename;
        } catch (error) {
            throw badRequestError();
        }
        const image = req.file.filename;

        const result = await profileService.updateUserImage({ userId, image });

        return res.status(httpStatus.OK).send({ image: result.image });
    } catch (error) {
        next(error);
    }
}

export async function namePut(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req as JwtPayload;
        const { name } = req.body;

        const result = await profileService.updateUserName({ userId, name });

        return res.status(httpStatus.OK).send({ name: result.name });
    } catch (error) {
        next(error);
    }
}
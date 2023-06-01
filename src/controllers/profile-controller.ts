import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import profileService from '@/services/profile-service';
import { JwtPayload } from 'jsonwebtoken';

export async function profilePost(req: Request, res: Response, next: NextFunction) {
    try {
        const { userId } = req as JwtPayload;
        const { name } = req.body;
        const image = req.file.filename;
        
        const result = await profileService.updateUser({ userId, name, image });

        return res.status(httpStatus.OK).send({ name: result.name, image: result.image });
    } catch (error) {
        console.log(error)
        next(error);
    }
}
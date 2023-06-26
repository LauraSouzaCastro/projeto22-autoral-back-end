import categoriesService from '../services/categories-service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

export async function getCategoriesByUserId(req: Request, res: Response, next: NextFunction) {
  const { userId } = req as JwtPayload;

  try {
    const result = await categoriesService.findByUserId(userId);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

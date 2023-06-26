import balanceService from '../services/balance-service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

export async function getBalanceByUserId(req: Request, res: Response, next: NextFunction) {
  const { userId } = req as JwtPayload;

  try {
    const result = await balanceService.balanceCalcByUserId(userId);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

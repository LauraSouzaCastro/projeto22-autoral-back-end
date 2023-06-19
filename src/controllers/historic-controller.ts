import historicService from '@/services/historic-service';
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

export async function getHistoricByUserId(req: Request, res: Response, next: NextFunction) {
  const { userId } = req as JwtPayload;

  try {
    const result = await historicService.historicByUserId(userId);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteTransactionById(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req as JwtPayload;
    const { transactionId } = req.params;

    await historicService.deleteTransactionById(userId, Number(transactionId));

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    next(error);
  }
}

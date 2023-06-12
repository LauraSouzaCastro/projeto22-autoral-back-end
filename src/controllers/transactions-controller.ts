import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import transactionsService from '@/services/transactions-service';

export async function transactionsPost(req: Request, res: Response, next: NextFunction) {

    const { typeTransaction, value, categoryName, color, dateTransaction, done, categoryId } = req.body;
    const { userId } = req as JwtPayload;

    try {
        await transactionsService.postTransactions({ userId, typeTransaction, value, categoryName, color, dateTransaction, done, categoryId });
        
        return res.sendStatus(httpStatus.CREATED);
    } catch (error) {
        next(error);
    }
}

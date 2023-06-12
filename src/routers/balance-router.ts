import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getBalanceByUserId } from '@/controllers';

const balanceRouter = Router();

balanceRouter
    .all('/*', authenticateToken)
    .get('/', getBalanceByUserId);

export { balanceRouter };
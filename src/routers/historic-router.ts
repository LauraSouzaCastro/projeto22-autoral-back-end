import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHistoricByUserId, deleteTransactionById } from '@/controllers';

const historicRouter = Router();

historicRouter
    .all('/*', authenticateToken)
    .get('/', getHistoricByUserId)
    .delete('/:transactionId', deleteTransactionById);

export { historicRouter };
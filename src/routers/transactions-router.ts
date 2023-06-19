import { Router } from 'express';

import { transationsSchema } from '@/schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { transactionsPost, getHistoricByUserId, deleteTransactionById } from '@/controllers';

const transactionsRouter = Router();

transactionsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(transationsSchema), transactionsPost)
    .get('/', getHistoricByUserId)
    .delete('/:transactionId', deleteTransactionById);

export { transactionsRouter };
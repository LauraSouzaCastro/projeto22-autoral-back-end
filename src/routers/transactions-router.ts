import { Router } from 'express';

import { transationsSchema } from '../schemas';
import { authenticateToken, validateBody } from '../middlewares';
import { transactionsPost, getHistoricByUserId, deleteTransactionById, getDataGrafic } from '../controllers';

const transactionsRouter = Router();

transactionsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(transationsSchema), transactionsPost)
    .get('/', getHistoricByUserId)
    .get('/data', getDataGrafic)
    .delete('/:transactionId', deleteTransactionById);

export { transactionsRouter };
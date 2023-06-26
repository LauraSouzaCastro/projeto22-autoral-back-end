import { Router } from 'express';

import { transationsSchema } from '../schemas';
import { authenticateToken, validateBody } from '../middlewares';
import { transactionsPost, getHistoricByUserId, deleteTransactionById, getDataGrafic, getNotificationsByUserId, updateTransactionById } from '../controllers';

const transactionsRouter = Router();

transactionsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(transationsSchema), transactionsPost)
    .get('/', getHistoricByUserId)
    .get('/data', getDataGrafic)
    .get('/notifications', getNotificationsByUserId)
    .put('/:transactionId', updateTransactionById)
    .delete('/:transactionId', deleteTransactionById);

export { transactionsRouter };
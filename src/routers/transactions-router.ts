import { Router } from 'express';

import { transationsSchema } from '@/schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { transactionsPost } from '@/controllers';

const transactionsRouter = Router();

transactionsRouter
    .all('/*', authenticateToken)
    .post('/', validateBody(transationsSchema), transactionsPost);

export { transactionsRouter };
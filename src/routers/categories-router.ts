import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getCategoriesByUserId } from '@/controllers';

const categoriesRouter = Router();

categoriesRouter
    .all('/*', authenticateToken)
    .get('/', getCategoriesByUserId);

export { categoriesRouter };
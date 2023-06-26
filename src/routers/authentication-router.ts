import { Router } from 'express';
import { singInPost, getSessions } from '../controllers';
import { authenticateToken, validateBody } from '../middlewares';
import { signInSchema } from '../schemas';

const authenticationRouter = Router();

authenticationRouter.post('/sign-in', validateBody(signInSchema), singInPost);
authenticationRouter.get('/sessions', authenticateToken, getSessions);

export { authenticationRouter };

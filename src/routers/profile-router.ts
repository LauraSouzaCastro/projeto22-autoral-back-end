import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@/config/multer';
import { createProfileSchema } from '@/schemas';
import { authenticateToken, validateBody } from '@/middlewares';
import { profilePost } from '@/controllers';

const profileRouter = Router();

const upload = multer(multerConfig);
profileRouter
    .all('/*', authenticateToken)
    .put('/', upload.single('image'), validateBody(createProfileSchema), profilePost);

export { profileRouter };
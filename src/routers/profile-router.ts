import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import { updateProfileSchema } from '../schemas';
import { authenticateToken, validateBody } from '../middlewares';
import { imagePut, namePut } from '../controllers';

const profileRouter = Router();

const upload = multer(multerConfig);
profileRouter
    .all('/*', authenticateToken)
    .put('/image', upload.single('image'), imagePut)
    .put('/name', validateBody(updateProfileSchema), namePut);

export { profileRouter };
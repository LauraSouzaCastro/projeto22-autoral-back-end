import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import authenticationService, { SignInParams } from '../services/authentication-service';
import { JwtPayload } from 'jsonwebtoken';

export async function singInPost(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as SignInParams;

  try {
    const result = await authenticationService.signIn({ email, password });

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

export async function getSessions(req: Request, res: Response, next: NextFunction) {
  const { userId } = req as JwtPayload;

  try {
    const result = await authenticationService.findByUserId(userId);

    return res.status(httpStatus.OK).send(result);
  } catch (error) {
    next(error);
  }
}

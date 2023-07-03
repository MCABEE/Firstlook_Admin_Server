import { NextFunction, Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import AppError from '../util/appError';
import env from '../util/validateEnv'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface MyJwtPayload extends JwtPayload {
    adminId: string;
    email: string;
    isMaster: boolean;
}

interface AuthenticatedRequest extends Request {
    decodedToken: MyJwtPayload
}

export const authMiddleware = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    //   get the token from the authorization header
    if (!req.headers.authorization) throw new AppError({ name: 'Un Authorized', statusCode: 401, message: 'Invalid request' })
    const token: string = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(JSON.parse(token), env.JWT_ACESS_SECRET) as MyJwtPayload;
    req.decodedToken = decodedToken;
    next()
})
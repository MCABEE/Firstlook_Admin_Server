import { NextFunction, Request, Response } from 'express';
import catchAsync from '../util/catchAsync';
import AppError from '../util/appError';
import env from '../util/validateEnv'
import jwt from 'jsonwebtoken'
import { adminJwtPayload, AuthenticatedRequest } from '../types';
// import tokenModel from '../models/tokens/tokenModel';


export const authMiddleware = catchAsync(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    //   get the token from the authorization header
    if (!req.headers.authorization) {
        throw new AppError({ name: 'Un Authorized', statusCode: 401, message: 'Invalid request' })
    }

    const token: string = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as adminJwtPayload;

    // const { signedCookies = {} } = req;
    // const { refreshToken } = signedCookies;

    // if (!refreshToken) {
    //     const error = new AppError({ statusCode: 401, message: 'Invalid request' })
    //     return next(error)
    // }

    // let refreshTokenInDB = tokenModel.findOne({ userId: decodedToken.adminId, refreshToken })
    // if (!refreshTokenInDB) {
    //     const error = new AppError({ statusCode: 401, message: 'Invalid token' })
    //     next(error)
    // }

    req.decodedToken = decodedToken;
    next()
})